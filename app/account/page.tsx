import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { ProfileForm } from "@/components/account/ProfileForm";
import { PasswordForm } from "@/components/account/PasswordForm";
import { ActivityList } from "@/components/account/ActivityList";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

export default async function AccountPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      activityLogs: {
        orderBy: { createdAt: "desc" },
        take: 25,
      },
      _count: {
        select: { listings: true, sentMessages: true },
      },
    },
  });

  if (!user) redirect("/login");

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Account settings</h1>
        <ThemeToggle />
      </div>

      <section className="card p-6">
        <h2 className="font-semibold mb-4">Profile</h2>
        <ProfileForm initialName={user.name ?? ""} initialEmail={user.email} />
      </section>

      <section className="card p-6">
        <h2 className="font-semibold mb-4">Password</h2>
        <PasswordForm hasPassword={!!user.password} />
      </section>

      <section className="card p-6">
        <h2 className="font-semibold mb-4">Account overview</h2>
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
              {new Date(user.createdAt).getFullYear()}
            </p>
            <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-1">Member since</p>
          </div>
        </div>
      </section>

      <section className="card p-6">
        <h2 className="font-semibold mb-2">Activity history</h2>
        <ActivityList entries={user.activityLogs} />
      </section>
    </div>
  );
}
