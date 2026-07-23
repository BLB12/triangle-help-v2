import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { UserTable } from "@/components/admin/UserTable";

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const session = await requireAdmin();
  const { q } = await searchParams;

  const users = await prisma.user.findMany({
    where: q
      ? {
          OR: [
            { name: { contains: q, mode: "insensitive" } },
            { email: { contains: q, mode: "insensitive" } },
          ],
        }
      : undefined,
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { listings: true, sentMessages: true } },
    },
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Admin dashboard</h1>
        <p className="text-sm text-neutral-400 dark:text-neutral-500">
          {users.length} user{users.length !== 1 ? "s" : ""}
        </p>
      </div>

      <form method="GET" className="mb-6">
        <input
          type="text"
          name="q"
          defaultValue={q ?? ""}
          placeholder="Search by name or email..."
          className="input max-w-sm"
        />
      </form>

      <UserTable users={users} currentUserId={session.user.id!} />
    </div>
  );
}