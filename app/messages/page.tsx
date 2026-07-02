import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { ConversationList } from "@/components/messaging/ConversationList";

export default async function MessagesPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const conversations = await prisma.conversation.findMany({
    where: {
      participants: { some: { userId: session.user.id } },
    },
    include: {
      participants: {
        include: { user: { select: { id: true, name: true, image: true } } },
      },
      messages: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Messages</h1>
      {conversations.length === 0 ? (
        <div className="card p-12 text-center">
          <div className="text-4xl mb-4">💬</div>
          <h3 className="font-semibold">No messages yet</h3>
          <p className="text-neutral-500 text-sm mt-1">When you contact a service provider, your conversation will appear here.</p>
        </div>
      ) : (
        <ConversationList conversations={conversations as any} currentUserId={session.user.id} />
      )}
    </div>
  );
}
