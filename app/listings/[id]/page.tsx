import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { notFound } from "next/navigation";
import { Star, MapPin, Clock } from "lucide-react";
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
    <div className="max-w-6xl mx-auto px-4 py-24">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-10">
          {/* Header */}
          <div>
            <span className="font-mono text-xs tracking-wide px-2.5 py-1 border border-brand-600 text-brand-600 dark:text-brand-300">
              [ {formatCategory(listing.category).toUpperCase()} ]
            </span>

            <h1 className="mt-5 font-display text-4xl md:text-5xl font-semibold tracking-tight">
              {listing.title}
            </h1>

            <div className="flex flex-wrap gap-5 mt-4 text-sm text-neutral-500">
              <span className="flex items-center gap-2 font-mono text-xs">
                <MapPin size={15} />
                {listing.city.toUpperCase()}
              </span>

              {listing.avgRating && (
                <span className="flex items-center gap-2 font-mono text-xs">
                  <Star size={15} className="fill-accent-500 text-accent-500" />
                  {listing.avgRating.toFixed(1)}
                  <span>({listing.reviewCount} reviews)</span>
                </span>
              )}
            </div>
          </div>

          {/* Hero image */}
          <div
            className="h-80 overflow-hidden bg-brand-500/10 flex items-center justify-center text-8xl border border-neutral-200 dark:border-neutral-800"
            style={{ clipPath: "polygon(0 0, calc(100% - 32px) 0, 100% 32px, 100% 100%, 0 100%)" }}
          >
            🏡
          </div>

          {/* Description */}
          <section className="border-t border-neutral-200 dark:border-neutral-800 pt-8">
            <h2 className="font-mono text-xs tracking-wide text-neutral-400 mb-4">
              ABOUT THIS SERVICE
            </h2>
            <p className="leading-relaxed text-neutral-600 dark:text-neutral-300 whitespace-pre-wrap">
              {listing.description}
            </p>
          </section>

          {/* Reviews */}
          <section className="border-t border-neutral-200 dark:border-neutral-800 pt-8">
            <h2 className="font-mono text-xs tracking-wide text-neutral-400 mb-6">
              REVIEWS ({listing.reviews.length})
            </h2>

            {listing.reviews.length === 0 ? (
              <div className="p-8 text-center text-neutral-400 border border-dashed border-neutral-200 dark:border-neutral-800">
                No reviews yet
              </div>
            ) : (
              <div className="space-y-4">
                {listing.reviews.map((review) => (
                  <div
                    key={review.id}
                    className="p-5 border border-neutral-200 dark:border-neutral-800"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-brand-500/10 text-brand-600 flex items-center justify-center font-semibold text-sm">
                        {review.reviewer.name?.[0] ?? "?"}
                      </div>

                      <span className="font-medium text-sm">{review.reviewer.name}</span>

                      <div className="ml-auto flex">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            size={14}
                            className={
                              i < review.rating
                                ? "fill-accent-500 text-accent-500"
                                : "text-neutral-300"
                            }
                          />
                        ))}
                      </div>
                    </div>

                    {review.comment && (
                      <p className="mt-3 text-sm text-neutral-600 dark:text-neutral-300">
                        {review.comment}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Booking card */}
        <aside>
          <div
            className="p-7 sticky top-28 border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900"
            style={{ clipPath: "polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 0 100%)" }}
          >
            <div className="font-mono text-3xl font-semibold mb-1 text-brand-600 dark:text-brand-300">
              {formatPrice(listing.price, listing.priceType)}
            </div>

            <p className="text-sm text-neutral-400 mb-6">{listing.city}, North Carolina</p>

            {!isOwner ? (
              <ContactButton
                providerId={listing.user.id}
                listingId={listing.id}
                isLoggedIn={!!session}
              />
            ) : (
              <div className="text-center text-neutral-400 py-3 text-sm">Your listing</div>
            )}

            <div className="mt-7 pt-6 border-t border-neutral-200 dark:border-neutral-800">
              <p className="font-mono text-xs tracking-wide text-neutral-400 mb-4">
                SERVICE PROVIDER
              </p>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-brand-500/10 text-brand-600 flex items-center justify-center font-semibold">
                  {listing.user.name?.[0] ?? "?"}
                </div>

                <div>
                  <p className="font-medium text-sm">{listing.user.name}</p>
                  <p className="text-xs text-neutral-400 flex items-center gap-1">
                    <Clock size={12} />
                    Member since {new Date(listing.user.createdAt).getFullYear()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
