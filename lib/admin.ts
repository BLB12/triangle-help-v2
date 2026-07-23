import { auth } from "@/auth";
import { redirect } from "next/navigation";

/**
 * Server-side guard for admin-only pages.
 * Redirects non-admins away; returns the session if authorized.
 */
export async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }
  if ((session.user as any).role !== "ADMIN") {
    redirect("/");
  }
  return session;
}
