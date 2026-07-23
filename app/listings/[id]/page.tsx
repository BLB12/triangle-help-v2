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
    <div className="max-w-6xl mx-auto px-4 py-12">

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">


        {/* Main content */}

        <div className="lg:col-span-2 space-y-8">


          {/* Header */}

          <div>

            <span className="
              inline-flex
              px-3
              py-1
              rounded-full
              text-xs
              font-medium
              bg-green-100
              text-green-700
              dark:bg-green-900/40
              dark:text-green-300
            ">
              {formatCategory(listing.category)}
            </span>


            <h1 className="
              mt-4
              text-4xl
              font-semibold
              tracking-tight
            ">
              {listing.title}
            </h1>


            <div className="
              flex
              flex-wrap
              gap-5
              mt-4
              text-sm
              text-neutral-500
            ">

              <span className="flex items-center gap-2">
                <MapPin size={16}/>
                {listing.city}
              </span>


              {listing.avgRating && (

                <span className="
                  flex
                  items-center
                  gap-2
                ">

                  <Star
                    size={16}
                    className="fill-yellow-400 text-yellow-400"
                  />

                  {listing.avgRating.toFixed(1)}

                  <span>
                    ({listing.reviewCount} reviews)
                  </span>

                </span>

              )}

            </div>

          </div>




          {/* Hero image */}

          <div className="
            h-80
            rounded-3xl
            overflow-hidden
            bg-gradient-to-br
            from-green-100
            to-green-200
            dark:from-green-950
            dark:to-neutral-900
            flex
            items-center
            justify-center
            text-8xl
          ">

            🏡

          </div>





          {/* Description */}

          <section className="card p-8">

            <h2 className="
              text-xl
              font-semibold
              mb-4
            ">
              About this service
            </h2>


            <p className="
              leading-relaxed
              text-neutral-600
              dark:text-neutral-300
              whitespace-pre-wrap
            ">
              {listing.description}
            </p>

          </section>







          {/* Reviews */}

          <section>

            <h2 className="
              text-xl
              font-semibold
              mb-5
            ">
              Reviews ({listing.reviews.length})
            </h2>


            {listing.reviews.length === 0 ? (

              <div className="
                card
                p-8
                text-center
                text-neutral-400
              ">
                No reviews yet
              </div>


            ) : (

              <div className="space-y-4">


              {listing.reviews.map((review)=>(

                <div
                  key={review.id}
                  className="
                    card
                    p-5
                  "
                >

                  <div className="
                    flex
                    items-center
                    gap-3
                  ">


                    <div className="
                      w-9
                      h-9
                      rounded-full
                      bg-green-200
                      text-green-800
                      flex
                      items-center
                      justify-center
                      font-semibold
                    ">
                      {review.reviewer.name?.[0] ?? "?"}
                    </div>


                    <span className="font-medium">
                      {review.reviewer.name}
                    </span>


                    <div className="ml-auto flex">

                      {Array.from({length:5}).map((_,i)=>(

                        <Star
                          key={i}
                          size={14}
                          className={
                            i < review.rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-neutral-300"
                          }
                        />

                      ))}

                    </div>


                  </div>


                  {review.comment && (

                    <p className="
                      mt-3
                      text-sm
                      text-neutral-600
                      dark:text-neutral-300
                    ">
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


          <div className="
            card
            p-7
            sticky
            top-28
          ">


            <div className="
              text-3xl
              font-semibold
              mb-1
              text-green-600
            ">
              {formatPrice(listing.price, listing.priceType)}
            </div>


            <p className="
              text-sm
              text-neutral-400
              mb-6
            ">
              {listing.city}, North Carolina
            </p>



            {!isOwner ? (

              <ContactButton
                providerId={listing.user.id}
                listingId={listing.id}
                isLoggedIn={!!session}
              />

            ) : (

              <div className="
                text-center
                text-neutral-400
                py-3
              ">
                Your listing
              </div>

            )}





            <div className="
              mt-7
              pt-6
              border-t
              border-neutral-200
              dark:border-neutral-800
            ">


              <p className="
                text-xs
                uppercase
                tracking-wide
                text-neutral-400
                mb-4
              ">
                Service provider
              </p>


              <div className="
                flex
                items-center
                gap-3
              ">


                <div className="
                  w-12
                  h-12
                  rounded-full
                  bg-green-200
                  text-green-800
                  flex
                  items-center
                  justify-center
                  font-semibold
                ">
                  {listing.user.name?.[0] ?? "?"}
                </div>


                <div>

                  <p className="font-medium">
                    {listing.user.name}
                  </p>


                  <p className="
                    text-xs
                    text-neutral-400
                    flex
                    items-center
                    gap-1
                  ">
                    <Clock size={12}/>
                    Member since {new Date(listing.user.createdAt).getFullYear()}
                  </p>

                </div>


              </div>


            </div>


          </div>


        </aside>


      </div>

    </div>
  );}
