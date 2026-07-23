import type { Metadata } from "next";
import "./globals.css";
import { SessionProvider } from "@/components/layout/SessionProvider";
import { Navbar } from "@/components/layout/Navbar";

export const metadata: Metadata = {
  title: {
    default: "Triangle Help",
    template: "%s | Triangle Help",
  },
  description:
    "Discover trusted local services and neighbors across Raleigh, Durham, and Chapel Hill.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased bg-background text-neutral-900 dark:text-neutral-50 selection:bg-brand-500/30">
        <SessionProvider>
          <Navbar />
          <div className="min-h-screen overflow-hidden">{children}</div>
        </SessionProvider>
      </body>
    </html>
  );
}
