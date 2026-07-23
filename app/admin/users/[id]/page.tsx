import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { RevokeButton } from "@/components/admin/RevokeButton";
import { ActivityList } from "@/components/account/ActivityList";

export default async function AdminUserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await requireAdmin();
  const { id } = await params;

  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      activityLogs: { orderBy: { createdAt: "desc" }, take: 50 },
      _count: { select: { listings: true, sentMessages: true } },
    },
  });

  if (!user) notFound();

  const isSelf = user.id === session.user.id;

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 space-y-6">
      <Link href="/admin" className="text-sm text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200">
        ← Back to all users
      </Link>

      <div className="card p-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-brand-200 dark:bg-brand-900 flex items-center justify-center font-semibold text-brand-700 dark:text-brand-300 text-lg overflow-hidden">
            {user.image ? (
              <img src={user.image} alt="" className="w-full h-full object-cover" />
            ) : (
              user.name?.[0] ?? user.email[0].toUpperCase()
            )}
          </div>
          <div>
            <h1 className="text-xl font-bold">{user.name ?? "Unnamed user"}</h1>
            <p className="text-sm text-neutral-400 dark:text-neutral-500">{user.email}</p>
            <p className="text-xs text-neutral-300 dark:text-neutral-600 mt-1">
              Joined {new Date(user.createdAt).toLocaleDateString()} · Role: {user.role}
            </p>
          </div>
        </div>
        {isSelf ? (
          <span className="text-xs text-neutral-300 dark:text-neutral-600">This is you</span>
        ) : (
          <RevokeButton userId={user.id} banned={user.banned} />
        )}
      </div>

      <div className="card p-6">
        <h2 className="font-semibold mb-4">Usage</h2>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-brand-600 dark:text-brand-400">
              {user._count.listings}
            </p>
            <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-1">Listings</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-brand-600 dark:text-brand-400">
              {user._count.sentMessages}
            </p>
            <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-1">Messages sent</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-brand-600 dark:text-brand-400">
              {user.banned ? "Revoked" : "Active"}
            </p>
            <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-1">Status</p>
          </div>
        </div>
      </div>

      <div className="card p-6">
        <h2 className="font-semibold mb-2">Activity history</h2>
        <ActivityList entries={user.activityLogs} />
      </div>
    </div>
  );
}