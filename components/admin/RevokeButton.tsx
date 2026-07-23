"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function RevokeButton({ userId, banned }: { userId: string; banned: boolean }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleClick() {
    const confirmed = window.confirm(
      banned
        ? "Restore this user's access? They'll be able to log in again."
        : "Revoke this user's access? They will be immediately signed out and unable to log in."
    );
    if (!confirmed) return;

    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ banned: !banned }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong");
        setLoading(false);
        return;
      }
      router.refresh();
    } catch {
      setError("Network error — please try again");
      setLoading(false);
    }
  }

  return (
    <div>
      <button
        onClick={handleClick}
        disabled={loading}
        className={
          banned
            ? "btn-secondary text-xs px-3 py-1.5"
            : "inline-flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white font-medium px-3 py-1.5 rounded-xl text-xs transition-colors"
        }
      >
        {loading ? "Working..." : banned ? "Restore access" : "Revoke access"}
      </button>
      {error && <p className="text-xs text-red-600 dark:text-red-400 mt-1">{error}</p>}
    </div>
  );
}