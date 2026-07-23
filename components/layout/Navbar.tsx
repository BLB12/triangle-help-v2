"use client";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import { Menu, X, MessageSquare, PlusCircle, Search, Shield, Settings } from "lucide-react";

export function Navbar() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const isAdmin = (session?.user as any)?.role === "ADMIN";

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-neutral-200 shadow-sm dark:bg-neutral-950 dark:border-neutral-800">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center dark:shadow-glow">
            <span className="text-neutral-950 font-bold text-sm">TH</span>
          </div>
          <span className="font-display font-semibold text-neutral-900 text-lg hidden sm:block dark:text-neutral-100">
            Triangle Help
          </span>
        </Link>

        {/* Center search shortcut */}
        <Link
          href="/search"
          className="hidden md:flex items-center gap-2 text-sm text-neutral-500 bg-neutral-100 hover:bg-neutral-200 px-4 py-2 rounded-xl transition-colors dark:text-neutral-400 dark:bg-neutral-900 dark:hover:bg-neutral-800"
        >
          <Search size={15} />
          Search services near you...
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-3">
          {session ? (
            <>
              {isAdmin && (
                <Link
                  href="/admin"
                  className="flex items-center gap-1.5 text-brand-600 hover:text-brand-500 transition-colors text-sm font-medium dark:text-brand-400"
                >
                  <Shield size={15} /> Admin
                </Link>
              )}
              <Link href="/messages" className="text-neutral-600 hover:text-brand-600 transition-colors p-2 dark:text-neutral-400 dark:hover:text-brand-400">
                <MessageSquare size={20} />
              </Link>
              <Link href="/account" className="text-neutral-600 hover:text-brand-600 transition-colors p-2 dark:text-neutral-400 dark:hover:text-brand-400">
                <Settings size={20} />
              </Link>
              <Link href="/dashboard" className="text-neutral-600 hover:text-brand-600 transition-colors text-sm font-medium dark:text-neutral-400 dark:hover:text-brand-400">
                Dashboard
              </Link>
              <Link href="/listings/new" className="btn-primary">
                <PlusCircle size={16} /> List a Service
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="text-neutral-500 hover:text-neutral-800 transition-colors p-2 dark:text-neutral-400 dark:hover:text-neutral-100"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="btn-secondary">Sign In</Link>
              <Link href="/listings/new" className="btn-primary">
                <PlusCircle size={16} /> List a Service
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu toggle */}
        <button
          className="md:hidden p-2 text-neutral-600 dark:text-neutral-300"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-white border-t border-neutral-100 px-4 py-4 flex flex-col gap-3 dark:bg-neutral-950 dark:border-neutral-800">
          <Link href="/search" className="flex items-center gap-2 text-sm py-2 dark:text-neutral-200" onClick={() => setOpen(false)}>
            <Search size={16} /> Search Services
          </Link>
          {session ? (
            <>
              {isAdmin && (
                <Link href="/admin" className="flex items-center gap-2 text-sm py-2 text-brand-600 dark:text-brand-400" onClick={() => setOpen(false)}>
                  <Shield size={16} /> Admin
                </Link>
              )}
              <Link href="/dashboard" className="text-sm py-2 dark:text-neutral-200" onClick={() => setOpen(false)}>Dashboard</Link>
              <Link href="/messages" className="text-sm py-2 dark:text-neutral-200" onClick={() => setOpen(false)}>Messages</Link>
              <Link href="/account" className="text-sm py-2 dark:text-neutral-200" onClick={() => setOpen(false)}>Account settings</Link>
              <Link href="/listings/new" className="btn-primary w-full justify-center" onClick={() => setOpen(false)}>
                List a Service
              </Link>
              <button onClick={() => signOut({ callbackUrl: "/" })} className="text-sm text-neutral-500 py-2 text-left dark:text-neutral-400">
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="btn-secondary w-full justify-center" onClick={() => setOpen(false)}>Sign In</Link>
              <Link href="/signup" className="btn-secondary w-full justify-center" onClick={() => setOpen(false)}>Create Account</Link>
              <Link href="/listings/new" className="btn-primary w-full justify-center" onClick={() => setOpen(false)}>List a Service</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
