import Link from "next/link";
import { RevokeButton } from "./RevokeButton";

interface UserRow {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  role: string;
  banned: boolean;
  createdAt: Date;
  _count: { listings: number; sentMessages: number };
}

export function UserTable({ users, currentUserId }: { users: UserRow[]; currentUserId: string }) {
  if (users.length === 0) {
    return (
      <div className="card p-8 text-center text-neutral-400 dark:text-neutral-500 text-sm">
        No users match your search.
      </div>
    );
  }

  return (
    <div className="card overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-neutral-100 dark:border-neutral-700 text-left text-neutral-400 dark:text-neutral-500">
            <th className="px-4 py-3 font-medium">User</th>
            <th className="px-4 py-3 font-medium">Role</th>
            <th className="px-4 py-3 font-medium">Joined</th>
            <th className="px-4 py-3 font-medium">Listings</th>
            <th className="px-4 py-3 font-medium">Messages</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-100 dark:divide-neutral-700">
          {users.map((user) => (
            <tr key={user.id}>
              <td className="px-4 py-3">
                <Link href={`/admin/users/${user.id}`} className="flex items-center gap-3 hover:underline">
                  <div className="w-8 h-8 rounded-full bg-brand-200 dark:bg-brand-900 flex items-center justify-center font-semibold text-brand-700 dark:text-brand-300 text-xs overflow-hidden">
                    {user.image ? (
                      <img src={user.image} alt="" className="w-full h-full object-cover" />
                    ) : (
                      user.name?.[0] ?? user.email[0].toUpperCase()
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-neutral-800 dark:text-neutral-100">
                      {user.name ?? "Unnamed"}
                    </p>
                    <p className="text-xs text-neutral-400 dark:text-neutral-500">{user.email}</p>
                  </div>
                </Link>
              </td>
              <td className="px-4 py-3">
                <span
                  className={
                    user.role === "ADMIN"
                      ? "text-xs font-semibold bg-brand-100 dark:bg-brand-900 text-brand-700 dark:text-brand-300 px-2 py-0.5 rounded-full"
                      : "text-xs text-neutral-400 dark:text-neutral-500"
                  }
                >
                  {user.role}
                </span>
              </td>
              <td className="px-4 py-3 text-neutral-500 dark:text-neutral-400">
                {new Date(user.createdAt).toLocaleDateString()}
              </td>
              <td className="px-4 py-3 text-neutral-500 dark:text-neutral-400">
                {user._count.listings}
              </td>
              <td className="px-4 py-3 text-neutral-500 dark:text-neutral-400">
                {user._count.sentMessages}
              </td>
              <td className="px-4 py-3">
                {user.banned ? (
                  <span className="text-xs font-semibold bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 px-2 py-0.5 rounded-full">
                    Revoked
                  </span>
                ) : (
                  <span className="text-xs font-semibold bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 px-2 py-0.5 rounded-full">
                    Active
                  </span>
                )}
              </td>
              <td className="px-4 py-3">
                {user.id === currentUserId ? (
                  <span className="text-xs text-neutral-300 dark:text-neutral-600">You</span>
                ) : (
                  <RevokeButton userId={user.id} banned={user.banned} />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}