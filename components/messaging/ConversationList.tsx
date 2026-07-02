"use client";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

interface Participant {
  user: { id: string; name: string | null; image: string | null };
}
interface Message { content: string; createdAt: Date; read: boolean; senderId: string; }
interface Conversation {
  id: string;
  updatedAt: Date;
  participants: Participant[];
  messages: Message[];
}

export function ConversationList({ conversations, currentUserId }: { conversations: Conversation[]; currentUserId: string }) {
  return (
    <div className="card divide-y divide-neutral-100">
      {conversations.map((conv) => {
        const other = conv.participants.find((p) => p.user.id !== currentUserId)?.user;
        const lastMsg = conv.messages[0];
        const unread = lastMsg && !lastMsg.read && lastMsg.senderId !== currentUserId;

        return (
          <Link key={conv.id} href={`/messages/${conv.id}`} className="flex items-center gap-4 p-4 hover:bg-neutral-50 transition-colors">
            <div className="w-11 h-11 rounded-full bg-brand-200 flex items-center justify-center text-brand-700 font-semibold text-sm shrink-0">
              {other?.name?.[0] ?? "?"}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className={`text-sm ${unread ? "font-semibold text-neutral-900" : "font-medium text-neutral-700"}`}>
                  {other?.name ?? "Unknown"}
                </span>
                <span className="text-xs text-neutral-400 shrink-0 ml-2">
                  {formatDistanceToNow(new Date(conv.updatedAt), { addSuffix: true })}
                </span>
              </div>
              <p className={`text-xs truncate mt-0.5 ${unread ? "text-neutral-800 font-medium" : "text-neutral-500"}`}>
                {lastMsg?.content ?? "Start a conversation"}
              </p>
            </div>
            {unread && <div className="w-2.5 h-2.5 bg-brand-600 rounded-full shrink-0" />}
          </Link>
        );
      })}
    </div>
  );
}
