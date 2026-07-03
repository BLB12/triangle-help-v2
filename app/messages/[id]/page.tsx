import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import { ChatWindow } from "@/components/messaging/ChatWindow";

export default async function ConversationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  const conversation = await prisma.conversation.findUnique({
    where: { id },
    include: {
      participants: {
        include: { user: { select: { id: true, name: true, image: true } } },
      },
      messages: {
        include: { sender: { select: { id: true, name: true } } },
        orderBy: { createdAt: "asc" },
      },
    },
  });
  if (!conversation) notFound();
  const isMember = conversation.participants.some((p) => p.user.id === session.user.id);
  if (!isMember) redirect("/messages");
  // Mark messages as read
  await prisma.message.updateMany({
    where: { conversationId: id, receiverId: session.user.id, read: false },
    data: { read: true },
  });
  const other = conversation.participants.find((p) => p.user.id !== session.user.id)?.user;
  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <a href="/messages" className="text-neutral-400 hover:text-neutral-600 text-sm">← Messages</a>
        <div className="w-9 h-9 rounded-full bg-brand-200 flex items-center justify-center text-brand-700 font-semibold text-sm">
          {other?.name?.[0] ?? "?"}
        </div>
        <h1 className="font-semibold">{other?.name ?? "Conversation"}</h1>
      </div>
      <ChatWindow
        conversationId={id}
        messages={conversation.messages as any}
        currentUserId={session.user.id}
        otherUser={other as any}
      />
    </div>
  );
}
