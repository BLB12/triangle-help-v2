import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { recipientId, listingId } = await req.json();
  if (recipientId === session.user.id) return NextResponse.json({ error: "Can't message yourself" }, { status: 400 });

  // Check for existing conversation between these two users
  const existing = await prisma.conversation.findFirst({
    where: {
      AND: [
        { participants: { some: { userId: session.user.id } } },
        { participants: { some: { userId: recipientId } } },
      ],
    },
  });

  if (existing) return NextResponse.json({ conversationId: existing.id });

  const conversation = await prisma.conversation.create({
    data: {
      listingId,
      participants: {
        create: [
          { userId: session.user.id },
          { userId: recipientId },
        ],
      },
    },
  });

  return NextResponse.json({ conversationId: conversation.id }, { status: 201 });
}
