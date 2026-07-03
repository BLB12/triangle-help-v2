import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { notFound } from "next/navigation";
import { Star, MapPin, MessageSquare, Clock } from "lucide-react";
import { formatPrice, formatCategory } from "@/lib/utils";
import { ContactButton } from "@/components/listings/ContactButton";

export default async function ListingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();

  const listing = await prisma.listing.findUnique({
    where: { id },
    include: {
      user: { select: { id: true, name: true, image: true, createdAt: true } },
      reviews: {
        include: { reviewer: { select: { name: true } } },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!listing || listing.status !== "ACTIVE") notFound();

  const isOwner = session?.user?.id === listing.userId;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-semibold bg-brand-100 text-brand-700 px-2.5 py-1 rounded-full">
                {formatCategory(listing.category)}
              </span>
            </div>
            <h1 className="text-2xl font-bold">{listing.title}</h1>
            <div className="flex items-center gap-4 mt-2 text-sm text-neutral-500">
              <span className="flex items-center gap-1"><MapPin size={14} /> {listing.city}</span>
              {listing.avgRating && (
                <span className="flex items-center gap-1">
                  <Star size={14} className="fill-yellow-400 text-yellow-400" />
                  {listing.avgRating.toFixed(1)} ({listing.reviewCount} reviews)
                </span>
              )}
            </div>
          </div>

          <div className="h-56 bg-gradient-to-br from-brand-100 to-brand-200 rounded-2xl flex items-center justify-center text-6xl">
            🏡
          </div>

          <div className="card p-6">
            <h2 className="font-semibold mb-3">About this service</h2>
            <p className="text-neutral-700 text-sm leading-relaxed whitespace-pre-wrap">{listing.description}</p>
          </div>

          <div>
            <h2 className="font-semibold mb-4">Reviews ({listing.reviews.length})</h2>
            {listing.reviews.length === 0 ? (
              <div className="card p-6 text-center text-neutral-400 text-sm">No reviews yet — be the first!</div>
            ) : (
              <div className="space-y-3">
                {listing.reviews.map((review) => (
                  <div key={review.id} className="card p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-7 h-7 rounded-full bg-brand-100 flex items-center justify-center text-xs font-semibold text-brand-700">
                        {review.reviewer.name?.[0] ?? "?"}
                      </div>
                      <span className="text-sm font-medium">{review.reviewer.name}</span>
                      <span className="flex ml-auto">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} size={13} className={i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-neutral-200"} />
                        ))}
                      </span>
                    </div>
                    {review.comment && <p className="text-sm text-neutral-600">{review.comment}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="card p-5 sticky top-20">
            <div className="text-2xl font-bold text-brand-700 mb-1">
              {formatPrice(listing.price, listing.priceType)}
            </div>
            <p className="text-xs text-neutral-400 mb-5">Posted in {listing.city}, NC</p>

            {!isOwner ? (
              <ContactButton
                providerId={listing.user.id}
                listingId={listing.id}
                isLoggedIn={!!session}
              />
            ) : (
              <div className="text-sm text-neutral-400 text-center py-2">This is your listing</div>
            )}

            <div className="mt-5 pt-5 border-t border-neutral-100">
              <p className="text-xs text-neutral-400 uppercase font-medium tracking-wide mb-3">Service provider</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-brand-200 flex items-center justify-center font-semibold text-brand-700">
                  {listing.user.name?.[0] ?? "?"}
                </div>
                <div>
                  <p className="font-medium text-sm">{listing.user.name}</p>
                  <p className="text-xs text-neutral-400 flex items-center gap-1">
                    <Clock size={11} /> Member since {new Date(listing.user.createdAt).getFullYear()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}