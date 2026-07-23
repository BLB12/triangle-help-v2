import { auth } from "@/auth";
import { redirect } from "next/navigation";

export async function requireAdmin() {
  const session = await auth();

  console.log("ADMIN SESSION:", JSON.stringify(session, null, 2));

  if (!session?.user?.id) {
    redirect("/login");
  }

  if ((session.user as any).role !== "ADMIN") {
    console.log("FAILED ADMIN ROLE:", (session.user as any).role);
    redirect("/");
  }

  return session;
}