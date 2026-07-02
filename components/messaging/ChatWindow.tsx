"use client";
import { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Message {
  id: string;
  content: string;
  createdAt: Date;
  senderId: string;
  sender: { id: string; name: string | null };
}

interface Props {
  conversationId: string;
  messages: Message[];
  currentUserId: string;
  otherUser: { id: string; name: string | null } | null;
}

export function ChatWindow({ conversationId, messages: initial, currentUserId, otherUser }: Props) {
  const [messages, setMessages] = useState(initial);
  const [content, setContent] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim() || sending) return;
    setSending(true);

    const optimistic: Message = {
      id: Date.now().toString(),
      content,
      createdAt: new Date(),
      senderId: currentUserId,
      sender: { id: currentUserId, name: "You" },
    };
    setMessages((m) => [...m, optimistic]);
    setContent("");

    const res = await fetch(`/api/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ conversationId, content, receiverId: otherUser?.id }),
    });

    if (!res.ok) {
      setMessages((m) => m.filter((msg) => msg.id !== optimistic.id));
    }
    setSending(false);
  }

  return (
    <div className="card flex flex-col" style={{ height: "60vh" }}>
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 && (
          <div className="text-center text-neutral-400 text-sm py-10">
            Start the conversation! Say hello 👋
          </div>
        )}
        {messages.map((msg) => {
          const isMe = msg.senderId === currentUserId;
          return (
            <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-xs lg:max-w-sm ${isMe ? "bg-brand-600 text-white" : "bg-neutral-100 text-neutral-900"} rounded-2xl px-4 py-2.5`}>
                <p className="text-sm leading-relaxed">{msg.content}</p>
                <p className={`text-xs mt-1 ${isMe ? "text-brand-200" : "text-neutral-400"}`}>
                  {formatDistanceToNow(new Date(msg.createdAt), { addSuffix: true })}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form onSubmit={send} className="border-t border-neutral-100 p-3 flex gap-2">
        <input
          className="input flex-1"
          placeholder="Type a message..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button type="submit" disabled={sending || !content.trim()} className="btn-primary px-4">
          <Send size={16} />
        </button>
      </form>
    </div>
  );
}
