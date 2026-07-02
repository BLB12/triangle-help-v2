import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { SessionProvider } from "@/components/layout/SessionProvider";
import { auth } from "@/auth";

export const metadata: Metadata = {
  title: "Triangle Help — Local Services in the Triangle",
  description: "Find and hire trusted local helpers for lawn care, cleaning, handyman work, and more in the Triangle area of North Carolina.",
  openGraph: {
    title: "Triangle Help",
    description: "Local services marketplace for the Triangle, NC",
    type: "website",
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-screen bg-neutral-50 font-sans antialiased">
        <SessionProvider session={session}>
          <Navbar />
          <main>{children}</main>
          <footer className="bg-neutral-900 text-neutral-400 text-sm py-10 mt-20">
            <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between gap-4">
              <div>
                <span className="text-white font-semibold text-base">Triangle Help</span>
                <p className="mt-1">Connecting neighbors in Raleigh, Durham & Chapel Hill.</p>
              </div>
              <div className="flex gap-8 text-sm">
                <div>
                  <p className="text-white font-medium mb-2">Browse</p>
                  <a href="/search" className="block hover:text-white">All Services</a>
                  <a href="/search?category=LAWN_CARE" className="block hover:text-white">Lawn Care</a>
                  <a href="/search?category=CLEANING" className="block hover:text-white">Cleaning</a>
                </div>
                <div>
                  <p className="text-white font-medium mb-2">Account</p>
                  <a href="/login" className="block hover:text-white">Sign In</a>
                  <a href="/signup" className="block hover:text-white">Sign Up</a>
                  <a href="/dashboard" className="block hover:text-white">Dashboard</a>
                </div>
              </div>
            </div>
            <div className="max-w-6xl mx-auto px-4 mt-8 pt-6 border-t border-neutral-800 text-xs">
              © {new Date().getFullYear()} Triangle Help. All rights reserved.
            </div>
          </footer>
        </SessionProvider>
      </body>
    </html>
  );
}
