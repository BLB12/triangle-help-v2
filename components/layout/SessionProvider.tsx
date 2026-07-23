"use client";

import { SessionProvider as NextAuthSessionProvider } from "next-auth/react";
import { ThemeProvider } from "@/components/theme/ThemeProvider";

export function SessionProvider({
  children,
  session,
}: {
  children: React.ReactNode;
  session?: any;
}) {
  return (
    <NextAuthSessionProvider session={session}>
      <ThemeProvider>
        {children}
      </ThemeProvider>
    </NextAuthSessionProvider>
  );
}