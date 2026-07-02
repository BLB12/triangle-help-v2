import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const schema = z.object({
  title: z.string().min(5),
  description: z.string().min(20),
  category: z.string(),
  price: z.coerce.number().positive(),
  priceType: z.enum(["HOURLY", "FLAT", "STARTING_AT"]),
  city: z.string().min(2),
  zipCode: z.string().min(5),
});

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input", details: parsed.error.flatten() }, { status: 400 });

  const listing = await prisma.listing.create({
    data: {
      ...parsed.data,
      category: parsed.data.category as any,
      userId: session.user.id,
      status: "PENDING", // becomes ACTIVE after Stripe payment
    },
  });

  return NextResponse.json(listing, { status: 201 });
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const where: any = { status: "ACTIVE" };

  const q = searchParams.get("q");
  const category = searchParams.get("category");
  const city = searchParams.get("city");

  if (q) where.OR = [
    { title: { contains: q, mode: "insensitive" } },
    { description: { contains: q, mode: "insensitive" } },
  ];
  if (category) where.category = category;
  if (city) where.city = { contains: city, mode: "insensitive" };

  const listings = await prisma.listing.findMany({
    where,
    include: { user: { select: { name: true, image: true } } },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return NextResponse.json(listings);
}
