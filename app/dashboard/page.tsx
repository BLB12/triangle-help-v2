import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { PlusCircle, MessageSquare, Star, CheckCircle, Clock, XCircle } from "lucide-react";
import { formatPrice, formatCategory } from "@/lib/utils";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const [listings, unreadCount] = await Promise.all([
    prisma.listing.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    }),
    prisma.message.count({
      where: { receiverId: session.user.id, read: false },
    }),
  ]);

  const activeCount = listings.filter((l) => l.status === "ACTIVE").length;
  const pendingCount = listings.filter((l) => l.status === "PENDING").length;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-neutral-500 text-sm mt-0.5">Welcome back, {session.user.name?.split(" ")[0] ?? "there"}</p>
        </div>
        <Link href="/listings/new" className="btn-primary">
          <PlusCircle size={16} /> New Listing
        </Link>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: "Active listings", value: activeCount, icon: <CheckCircle size={18} className="text-green-600" />, color: "bg-green-50" },
          { label: "Pending payment", value: pendingCount, icon: <Clock size={18} className="text-yellow-600" />, color: "bg-yellow-50" },
          { label: "Unread messages", value: unreadCount, icon: <MessageSquare size={18} className="text-brand-600" />, color: "bg-brand-50" },
        ].map((stat) => (
          <div key={stat.label} className={`card p-4 flex items-center gap-3`}>
            <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center shrink-0`}>{stat.icon}</div>
            <div>
              <div className="font-bold text-xl">{stat.value}</div>
              <div className="text-xs text-neutral-500">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="flex gap-3 mb-8">
        <Link href="/messages" className="btn-secondary">
          <MessageSquare size={16} /> Messages {unreadCount > 0 && <span className="bg-brand-600 text-white text-xs px-1.5 py-0.5 rounded-full">{unreadCount}</span>}
        </Link>
        <Link href={`/search?userId=${session.user.id}`} className="btn-secondary">
          View public profile
        </Link>
      </div>

      {/* Listings */}
      <h2 className="font-semibold mb-4">Your listings</h2>
      {listings.length === 0 ? (
        <div className="card p-10 text-center">
          <p className="text-neutral-500 mb-4">You haven't listed any services yet.</p>
          <Link href="/listings/new" className="btn-primary">Create your first listing</Link>
        </div>
      ) : (
        <div className="card divide-y divide-neutral-100">
          {listings.map((listing) => (
            <div key={listing.id} className="flex items-center justify-between p-4 gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    listing.status === "ACTIVE" ? "bg-green-100 text-green-700" :
                    listing.status === "PENDING" ? "bg-yellow-100 text-yellow-700" :
                    "bg-neutral-100 text-neutral-500"
                  }`}>
                    {listing.status === "ACTIVE" ? "✓ Active" : listing.status === "PENDING" ? "⏳ Awaiting payment" : listing.status}
                  </span>
                  <span className="text-xs text-neutral-400">{formatCategory(listing.category)}</span>
                </div>
                <p className="font-medium text-sm truncate">{listing.title}</p>
                <p className="text-xs text-neutral-500">{formatPrice(listing.price, listing.priceType)}</p>
              </div>
              <div className="flex gap-2 shrink-0">
                {listing.status === "PENDING" && (
                  <Link href={`/api/stripe/checkout`} className="text-xs text-brand-600 hover:underline font-medium">
                    Pay to activate
                  </Link>
                )}
                <Link href={`/listings/${listing.id}`} className="text-xs text-neutral-500 hover:text-neutral-800">
                  View →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
