import Link from "next/link";
import {
  Search,
  Star,
  Shield,
  ArrowRight,
  MapPin,
  Sparkles,
} from "lucide-react";

import { prisma } from "@/lib/prisma";
import { ListingCard } from "@/components/listings/ListingCard";
import { SmartSearch } from "@/components/search/SmartSearch";
import { CATEGORIES } from "@/lib/utils";

async function getFeaturedListings() {
  return prisma.listing.findMany({
    where: { status: "ACTIVE" },
    include: {
      user: { select: { name: true, image: true } },
    },
    orderBy: [{ featured: "desc" }, { avgRating: "desc" }],
    take: 6,
  });
}

export default async function HomePage() {
  const listings = await getFeaturedListings();

  return (
    <main className="overflow-hidden">
      {/* HERO */}
      <section className="relative px-6 pt-32 pb-20 text-center">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-brand-500/15 via-transparent to-transparent" />

        <div className="max-w-6xl mx-auto">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-neutral-100 dark:bg-neutral-800 text-sm mb-10">
            <MapPin size={15} />
            Triangle Region
          </div>

          <h1 className="font-display text-6xl md:text-8xl font-semibold tracking-[-0.03em] leading-[0.95]">
            Local help.
            <br />
            <span className="text-brand-600 dark:text-brand-300">Reimagined.</span>
          </h1>

          <p className="max-w-2xl mx-auto mt-8 text-xl text-neutral-500 leading-relaxed">
            Find trusted people for anything you need, or turn your skills
            into opportunities.
          </p>

          <div className="mt-12">
            <SmartSearch />
          </div>
        </div>
      </section>

      {/* DISCOVER */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="flex items-center gap-3 mb-8">
          <Sparkles size={22} className="text-brand-600 dark:text-brand-300" />
          <h2 className="font-display text-3xl font-semibold tracking-tight">
            Explore possibilities
          </h2>
        </div>

        <div className="flex flex-wrap gap-3">
          {CATEGORIES.slice(0, 10).map((cat) => (
            <Link
              key={cat.value}
              href={`/search?category=${cat.value}`}
              className="px-6 py-3 rounded-full bg-neutral-100 dark:bg-neutral-800 hover:bg-brand-600 hover:text-white transition text-sm font-mono"
            >
              {cat.label}
            </Link>
          ))}
        </div>
      </section>

      {/* FEATURED */}
      {listings.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 py-20">
          <div className="flex justify-between items-end mb-10">
            <div>
              <p className="text-accent-500 text-sm font-mono mb-2">
                TRUSTED PROVIDERS
              </p>
              <h2 className="font-display text-4xl font-semibold">
                People nearby
              </h2>
            </div>

            <Link
              href="/search"
              className="text-brand-600 dark:text-brand-300 flex items-center gap-2"
            >
              View all
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
            {listings.map((listing) => (
              <ListingCard key={listing.id} listing={listing as any} />
            ))}
          </div>
        </section>
      )}

      {/* TRUST */}
      <section className="py-32 px-6">
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-16 text-center">
          {[
            { icon: <Search size={30} />, title: "Discover", text: "Find people who fit your needs." },
            { icon: <Shield size={30} />, title: "Connect", text: "Communicate with confidence." },
            { icon: <Star size={30} />, title: "Trust", text: "Real reviews from your community." },
          ].map((item) => (
            <div key={item.title}>
              <div className="mx-auto mb-6 w-16 h-16 rounded-3xl bg-brand-500/10 text-brand-600 dark:text-brand-300 flex items-center justify-center">
                {item.icon}
              </div>
              <h3 className="font-display text-2xl font-semibold mb-3">
                {item.title}
              </h3>
              <p className="text-neutral-500">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FINAL */}
      <section className="py-32 text-center">
        <h2 className="font-display text-5xl font-semibold tracking-tight">
          Your community.
          <br />
          Connected.
        </h2>

        <Link href="/listings/new" className="btn-primary inline-flex mt-10">
          Offer your skills
        </Link>
      </section>
    </main>
  );
}
