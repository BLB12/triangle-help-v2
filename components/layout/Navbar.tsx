"use client";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import { Menu, X, MessageSquare, User, LogOut, PlusCircle, Search } from "lucide-react";

export function Navbar() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-neutral-200 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">TH</span>
          </div>
          <span className="font-semibold text-neutral-900 text-lg hidden sm:block">Triangle Help</span>
        </Link>

        {/* Center search shortcut */}
        <Link href="/search" className="hidden md:flex items-center gap-2 text-sm text-neutral-500 bg-neutral-100 hover:bg-neutral-200 px-4 py-2 rounded-xl transition-colors">
          <Search size={15} />
          Search services near you...
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-3">
          {session ? (
            <>
              <Link href="/messages" className="text-neutral-600 hover:text-brand-600 transition-colors p-2">
                <MessageSquare size={20} />
              </Link>
              <Link href="/dashboard" className="text-neutral-600 hover:text-brand-600 transition-colors text-sm font-medium">
                Dashboard
              </Link>
              <Link href="/listings/new" className="btn-primary">
                <PlusCircle size={16} /> List a Service
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="text-neutral-500 hover:text-neutral-800 transition-colors p-2"
              >
                <LogOut size={18} />
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
        <button className="md:hidden p-2 text-neutral-600" onClick={() => setOpen(!open)}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-white border-t border-neutral-100 px-4 py-4 flex flex-col gap-3">
          <Link href="/search" className="flex items-center gap-2 text-sm py-2" onClick={() => setOpen(false)}>
            <Search size={16} /> Search Services
          </Link>
          {session ? (
            <>
              <Link href="/dashboard" className="text-sm py-2" onClick={() => setOpen(false)}>Dashboard</Link>
              <Link href="/messages" className="text-sm py-2" onClick={() => setOpen(false)}>Messages</Link>
              <Link href="/listings/new" className="btn-primary w-full justify-center" onClick={() => setOpen(false)}>
                List a Service
              </Link>
              <button onClick={() => signOut({ callbackUrl: "/" })} className="text-sm text-neutral-500 py-2 text-left">Sign Out</button>
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
