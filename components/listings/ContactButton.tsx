"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { MessageSquare } from "lucide-react";

interface Props {
  providerId: string;
  listingId: string;
  isLoggedIn: boolean;
}

export function ContactButton({ providerId, listingId, isLoggedIn }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleContact() {
    if (!isLoggedIn) { router.push("/login"); return; }
    setLoading(true);
    const res = await fetch("/api/messages/start", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ recipientId: providerId, listingId }),
    });
    const data = await res.json();
    if (data.conversationId) router.push(`/messages/${data.conversationId}`);
    setLoading(false);
  }

  return (
    <button onClick={handleContact} disabled={loading} className="btn-primary w-full justify-center py-3">
      <MessageSquare size={17} />
      {loading ? "Starting chat..." : "Message Provider"}
    </button>
  );
}
