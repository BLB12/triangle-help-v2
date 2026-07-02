import { prisma } from "@/lib/prisma";
import { SearchFilters } from "@/components/filters/SearchFilters";
import { ListingCard } from "@/components/listings/ListingCard";
import { CATEGORIES } from "@/lib/utils";

interface SearchParams {
  q?: string;
  category?: string;
  city?: string;
  minPrice?: string;
  maxPrice?: string;
  minRating?: string;
  sort?: string;
}

async function searchListings(params: SearchParams) {
  const where: any = { status: "ACTIVE" };

  if (params.q) {
    where.OR = [
      { title: { contains: params.q, mode: "insensitive" } },
      { description: { contains: params.q, mode: "insensitive" } },
    ];
  }
  if (params.category) where.category = params.category;
  if (params.city) where.city = { contains: params.city, mode: "insensitive" };
  if (params.minPrice || params.maxPrice) {
    where.price = {};
    if (params.minPrice) where.price.gte = parseFloat(params.minPrice);
    if (params.maxPrice) where.price.lte = parseFloat(params.maxPrice);
  }
  if (params.minRating) {
    where.avgRating = { gte: parseFloat(params.minRating) };
  }

  const orderBy: any =
    params.sort === "price_asc" ? { price: "asc" } :
    params.sort === "price_desc" ? { price: "desc" } :
    params.sort === "rating" ? { avgRating: "desc" } :
    { createdAt: "desc" };

  return prisma.listing.findMany({
    where,
    include: { user: { select: { name: true, image: true } } },
    orderBy,
    take: 50,
  });
}

export default async function SearchPage({ searchParams }: { searchParams: SearchParams }) {
  const listings = await searchListings(searchParams);
  const hasQuery = Object.values(searchParams).some(Boolean);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">
          {searchParams.q ? `Results for "${searchParams.q}"` :
           searchParams.category ? CATEGORIES.find(c => c.value === searchParams.category)?.label ?? "Services" :
           "All Services"}
        </h1>
        <p className="text-neutral-500 text-sm mt-1">{listings.length} service{listings.length !== 1 ? "s" : ""} found</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar filters */}
        <aside className="w-full lg:w-64 shrink-0">
          <SearchFilters currentParams={searchParams} />
        </aside>

        {/* Results */}
        <div className="flex-1">
          {listings.length === 0 ? (
            <div className="card p-12 text-center">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="font-semibold text-lg mb-2">No services found</h3>
              <p className="text-neutral-500 text-sm">Try adjusting your filters or search terms.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {listings.map((listing) => (
                <ListingCard key={listing.id} listing={listing as any} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
