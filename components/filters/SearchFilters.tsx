"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { CATEGORIES } from "@/lib/utils";

interface Props {
  currentParams: Record<string, string | undefined>;
}

export function SearchFilters({ currentParams }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [q, setQ] = useState(currentParams.q ?? "");
  const [category, setCategory] = useState(currentParams.category ?? "");
  const [city, setCity] = useState(currentParams.city ?? "");
  const [minPrice, setMinPrice] = useState(currentParams.minPrice ?? "");
  const [maxPrice, setMaxPrice] = useState(currentParams.maxPrice ?? "");
  const [minRating, setMinRating] = useState(currentParams.minRating ?? "");
  const [sort, setSort] = useState(currentParams.sort ?? "");

  function apply() {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (category) params.set("category", category);
    if (city) params.set("city", city);
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);
    if (minRating) params.set("minRating", minRating);
    if (sort) params.set("sort", sort);
    startTransition(() => router.push(`/search?${params.toString()}`));
  }

  function reset() {
    setQ(""); setCategory(""); setCity(""); setMinPrice(""); setMaxPrice(""); setMinRating(""); setSort("");
    startTransition(() => router.push("/search"));
  }

  return (
    <div className="card p-5 space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 font-semibold text-sm">
          <SlidersHorizontal size={16} /> Filters
        </div>
        <button onClick={reset} className="text-xs text-neutral-400 hover:text-neutral-700 flex items-center gap-1">
          <X size={12} /> Clear
        </button>
      </div>

      {/* Search query */}
      <div>
        <label className="label">Search</label>
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            className="input pl-9"
            placeholder="Lawn care, cleaning..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && apply()}
          />
        </div>
      </div>

      {/* Category */}
      <div>
        <label className="label">Category</label>
        <select className="input" value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">All categories</option>
          {CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>{c.label}</option>
          ))}
        </select>
      </div>

      {/* City */}
      <div>
        <label className="label">City</label>
        <input
          className="input"
          placeholder="Raleigh, Durham..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
      </div>

      {/* Price range */}
      <div>
        <label className="label">Price range ($/hr)</label>
        <div className="flex gap-2 items-center">
          <input className="input w-full" placeholder="Min" type="number" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} />
          <span className="text-neutral-400 text-sm">–</span>
          <input className="input w-full" placeholder="Max" type="number" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />
        </div>
      </div>

      {/* Minimum rating */}
      <div>
        <label className="label">Minimum rating</label>
        <div className="flex gap-2">
          {[0, 3, 4, 4.5].map((r) => (
            <button
              key={r}
              onClick={() => setMinRating(r === 0 ? "" : String(r))}
              className={`flex-1 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                (r === 0 && !minRating) || String(r) === minRating
                  ? "bg-brand-600 border-brand-600 text-white"
                  : "bg-white border-neutral-200 text-neutral-600 hover:border-brand-400"
              }`}
            >
              {r === 0 ? "Any" : `${r}★+`}
            </button>
          ))}
        </div>
      </div>

      {/* Sort */}
      <div>
        <label className="label">Sort by</label>
        <select className="input" value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="">Newest</option>
          <option value="rating">Highest rated</option>
          <option value="price_asc">Price: Low to high</option>
          <option value="price_desc">Price: High to low</option>
        </select>
      </div>

      <button
        onClick={apply}
        disabled={isPending}
        className="btn-primary w-full justify-center"
      >
        {isPending ? "Searching..." : "Apply Filters"}
      </button>
    </div>
  );
}
