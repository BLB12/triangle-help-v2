import Link from "next/link";
import { Star, MapPin } from "lucide-react";
import { formatPrice, formatCategory } from "@/lib/utils";

interface Listing {
  id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  priceType: string;
  city: string;
  image?: string | null;
  avgRating?: number | null;
  reviewCount: number;
  user: { name?: string | null; image?: string | null };
}

export function ListingCard({ listing }: { listing: Listing }) {
  return (
    <Link href={`/listings/${listing.id}`} className="card hover:shadow-md transition-shadow group block">
      {/* Image */}
      <div className="h-44 bg-gradient-to-br from-brand-100 to-brand-200 relative overflow-hidden">
        {listing.image ? (
          <img src={listing.image} alt={listing.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-brand-400">
            <span className="text-5xl">🏡</span>
          </div>
        )}
        <div className="absolute top-3 left-3">
          <span className="bg-white text-brand-700 text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm">
            {formatCategory(listing.category)}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-semibold text-neutral-900 text-sm leading-snug line-clamp-2 group-hover:text-brand-700 transition-colors">
            {listing.title}
          </h3>
          <span className="text-brand-700 font-bold text-sm whitespace-nowrap">
            {formatPrice(listing.price, listing.priceType)}
          </span>
        </div>

        <p className="text-neutral-500 text-xs line-clamp-2 mb-3">{listing.description}</p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-xs text-neutral-500">
            <MapPin size={12} />
            {listing.city}
          </div>
          {listing.avgRating ? (
            <div className="flex items-center gap-1 text-xs">
              <Star size={12} className="fill-yellow-400 text-yellow-400" />
              <span className="font-medium">{listing.avgRating.toFixed(1)}</span>
              <span className="text-neutral-400">({listing.reviewCount})</span>
            </div>
          ) : (
            <span className="text-xs text-neutral-400">No reviews yet</span>
          )}
        </div>

        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-neutral-100">
          <div className="w-6 h-6 rounded-full bg-brand-200 flex items-center justify-center text-xs font-semibold text-brand-700">
            {listing.user.name?.[0] ?? "?"}
          </div>
          <span className="text-xs text-neutral-500">{listing.user.name ?? "Local Helper"}</span>
        </div>
      </div>
    </Link>
  );
}
