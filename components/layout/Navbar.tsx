"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";

import {
  Menu,
  X,
  Search,
  MessageSquare,
  Plus,
  Shield,
  Settings,
  LogOut,
} from "lucide-react";

export function Navbar() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);

  const isAdmin = (session?.user as any)?.role === "ADMIN";

  function close() {
    setOpen(false);
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <nav className="border-b border-neutral-200 dark:border-neutral-800 bg-white/85 dark:bg-neutral-950/85 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto h-16 px-6 flex items-center justify-between">
          {/* LOGO */}
          <Link href="/" className="flex items-center gap-3" onClick={close}>
            <div
              className="w-8 h-8 bg-brand-600 flex items-center justify-center text-white font-mono text-xs font-semibold"
              style={{ clipPath: "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 0 100%)" }}
            >
              TH
            </div>
            <span className="font-display font-semibold tracking-tight">Triangle Help</span>
          </Link>

          {/* CENTER SEARCH */}
          <Link
            href="/search"
            className="hidden md:flex items-center gap-3 px-4 py-2 border border-neutral-200 dark:border-neutral-800 text-neutral-500 hover:border-brand-500 transition"
          >
            <Search size={15} />
            <span className="text-sm font-mono">ask for help...</span>
            <kbd className="hidden lg:block px-1.5 py-0.5 border border-neutral-300 dark:border-neutral-700 text-[10px] font-mono">
              ⌘K
            </kbd>
          </Link>

          {/* DESKTOP ACTIONS */}
          <div className="hidden md:flex items-center gap-1">
            {session ? (
              <>
                {isAdmin && (
                  <Link href="/admin" className="text-accent-500 p-2.5">
                    <Shield size={18} />
                  </Link>
                )}
                <Link
                  href="/messages"
                  className="p-2.5 text-neutral-500 hover:text-brand-600 transition"
                >
                  <MessageSquare size={19} />
                </Link>
                <Link
                  href="/account"
                  className="p-2.5 text-neutral-500 hover:text-brand-600 transition"
                >
                  <Settings size={19} />
                </Link>
                <Link
                  href="/listings/new"
                  className="flex items-center gap-2 px-4 py-2 ml-2 bg-brand-600 text-white text-sm font-medium hover:bg-brand-700 transition"
                >
                  <Plus size={15} />
                  Create
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm px-4 py-2 text-neutral-600 dark:text-neutral-300 hover:text-brand-600 transition"
                >
                  Sign in
                </Link>
                <Link
                  href="/listings/new"
                  className="px-4 py-2 ml-2 bg-brand-600 text-white text-sm font-medium hover:bg-brand-700 transition"
                >
                  Get started
                </Link>
              </>
            )}
          </div>

          {/* MOBILE TOGGLE */}
          <button onClick={() => setOpen(!open)} className="md:hidden p-2" aria-label="Menu">
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* MOBILE PANEL */}
        {open && (
          <div className="md:hidden border-t border-neutral-200 dark:border-neutral-800 px-6 py-4 flex flex-col gap-1">
            <Link
              href="/search"
              onClick={close}
              className="flex items-center gap-3 py-3 text-sm font-mono"
            >
              <Search size={16} />
              search
            </Link>

            {session ? (
              <>
                {isAdmin && (
                  <Link
                    href="/admin"
                    onClick={close}
                    className="flex items-center gap-3 py-3 text-sm text-accent-500"
                  >
                    <Shield size={16} />
                    Admin
                  </Link>
                )}
                <Link
                  href="/messages"
                  onClick={close}
                  className="flex items-center gap-3 py-3 text-sm"
                >
                  <MessageSquare size={16} />
                  Messages
                </Link>
                <Link
                  href="/account"
                  onClick={close}
                  className="flex items-center gap-3 py-3 text-sm"
                >
                  <Settings size={16} />
                  Account
                </Link>
                <Link
                  href="/listings/new"
                  onClick={close}
                  className="flex items-center gap-3 py-3 text-sm font-medium text-brand-600 dark:text-brand-300"
                >
                  <Plus size={16} />
                  Create listing
                </Link>
                <button
                  onClick={() => {
                    close();
                    signOut();
                  }}
                  className="flex items-center gap-3 py-3 text-sm text-left text-neutral-500"
                >
                  <LogOut size={16} />
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={close} className="py-3 text-sm">
                  Sign in
                </Link>
                <Link
                  href="/listings/new"
                  onClick={close}
                  className="py-3 text-sm font-medium text-brand-600 dark:text-brand-300"
                >
                  Get started
                </Link>
              </>
            )}
          </div>
        )}
      </nav>
    </header>
  );
}
