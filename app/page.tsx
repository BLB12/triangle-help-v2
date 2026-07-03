import Link from "next/link";
import { Search, Star, Shield, Zap, ArrowRight, MapPin } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { ListingCard } from "@/components/listings/ListingCard";
import { CATEGORIES, formatCategory } from "@/lib/utils";

async function getFeaturedListings() {
  return prisma.listing.findMany({
    where: { status: "ACTIVE" },
    include: { user: { select: { name: true, image: true } } },
    orderBy: [{ featured: "desc" }, { avgRating: "desc" }],
    take: 6,
  });
}

export default async function HomePage() {
  const listings = await getFeaturedListings();

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-brand-600 to-brand-800 text-white py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-brand-500/40 text-brand-100 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
            <MapPin size={14} /> Serving Raleigh, Durham & Chapel Hill
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold leading-tight mb-4">
            Neighbors helping neighbors in the Triangle
          </h1>
          <p className="text-brand-100 text-lg mb-8 max-w-xl mx-auto">
            Find trusted local helpers for lawn care, cleaning, handyman work, and more — or list your own services and start earning.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/search" className="inline-flex items-center justify-center gap-2 bg-white text-brand-700 font-semibold px-7 py-3.5 rounded-xl hover:bg-brand-50 transition-colors text-base">
              <Search size={18} /> Find Help
            </Link>
            <Link href="/listings/new" className="inline-flex items-center justify-center gap-2 bg-brand-500 hover:bg-brand-400 text-white font-semibold px-7 py-3.5 rounded-xl transition-colors text-base border border-brand-400">
              Offer Your Services <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Category pills */}
      <section className="max-w-6xl mx-auto px-4 py-10">
        <h2 className="text-xl font-semibold mb-4">Browse by category</h2>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.value}
              href={`/search?category=${cat.value}`}
              className="px-4 py-2 rounded-full bg-white border border-neutral-200 text-sm font-medium text-neutral-700 hover:border-brand-400 hover:text-brand-700 hover:bg-brand-50 transition-colors"
            >
              {cat.label}
            </Link>
          ))}
        </div>
      </section>

      {/* Featured listings */}
      {listings.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 pb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Featured services</h2>
            <Link href="/search" className="text-sm text-brand-600 hover:underline font-medium">
              View all →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {listings.map((listing) => (
              <ListingCard key={listing.id} listing={listing as any} />
            ))}
          </div>
        </section>
      )}

      {/* How it works */}
      <section className="bg-white border-t border-neutral-100 py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-12">How Triangle Help works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: <Search size={24} />, title: "Search & Filter", desc: "Browse hundreds of local services. Filter by category, distance, rating, and price to find exactly what you need." },
              { icon: <Shield size={24} />, title: "Connect Safely", desc: "Message service providers directly through our platform. Read reviews from your neighbors before you hire." },
              { icon: <Zap size={24} />, title: "Get It Done", desc: "Agree on the details, get the job done, and leave a review to help your community." },
            ].map((item) => (
              <div key={item.title} className="text-center">
                <div className="w-12 h-12 bg-brand-100 text-brand-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  {item.icon}
                </div>
                <h3 className="font-semibold mb-2">{item.title}</h3>
                <p className="text-neutral-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-brand-50 border-t border-brand-100 py-16 px-4 text-center">
        <h2 className="text-2xl font-bold mb-3">Ready to offer your services?</h2>
        <p className="text-neutral-600 mb-6 max-w-md mx-auto">
          List your service for just $9.99 and start connecting with neighbors who need your help.
        </p>
        <Link href="/listings/new" className="btn-primary text-base px-8 py-3">
          Get Started — $9.99
        </Link>
      </section>
    </div>
  );
}
