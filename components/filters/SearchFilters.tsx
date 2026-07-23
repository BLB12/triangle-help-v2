"use client";
import { useEffect, useState } from "react";
import { Star, Sparkles } from "lucide-react";
import { CATEGORIES } from "@/lib/utils";
import { useRouter } from "next/navigation";

export function SearchFilters({
  currentParams,
}: {
  currentParams: any;
}) {
  const router = useRouter();

  const suggestions = [
    "Pet sitting",
    "Child care",
    "Lawn maintenance",
    "House cleaning",
    "Handyman",
    "Moving help",
  ];

  const [text, setText] = useState("");
  const [price, setPrice] = useState(Number(currentParams?.maxPrice) || 150);
  const [rating, setRating] = useState(Number(currentParams?.minRating) || 0);
  const [category, setCategory] = useState(currentParams?.category || "");

  useEffect(() => {
    let wordIndex = 0;
    let charIndex = 0;
    let deleting = false;
    const timer = setInterval(() => {
      const word = suggestions[wordIndex];
      if (!deleting) {
        charIndex++;
        setText(word.slice(0, charIndex));
        if (charIndex === word.length) {
          setTimeout(() => {
            deleting = true;
          }, 800);
        }
      } else {
        charIndex--;
        setText(word.slice(0, charIndex));
        if (charIndex === 0) {
          deleting = false;
          wordIndex = (wordIndex + 1) % suggestions.length;
        }
      }
    }, 100);
    return () => clearInterval(timer);
  }, []);

  function applyFilters(overrides?: { category?: string }) {
    const params = new URLSearchParams();

    // preserve whatever's already active (q, city, etc.)
    if (currentParams?.q) params.set("q", currentParams.q);
    if (currentParams?.city) params.set("city", currentParams.city);

    const nextCategory = overrides?.category ?? category;
    if (nextCategory) params.set("category", nextCategory);

    if (price < 300) params.set("maxPrice", price.toString());
    if (rating > 0) params.set("minRating", rating.toString());

    router.push(`/search?${params.toString()}`);
  }

  function toggleCategory(value: string) {
    const next = category === value ? "" : value;
    setCategory(next);
    applyFilters({ category: next });
  }

  return (
    <div className="w-full space-y-10">
      {/* Smart Search */}
      <div className="rounded-3xl bg-neutral-100 dark:bg-neutral-800 p-6">
        <div className="flex items-center gap-2 text-brand-600 dark:text-brand-300 mb-5 font-medium">
          <Sparkles size={18} />
          Smart search
        </div>
        <div className="text-xl font-medium">
          {text}
          <span className="animate-pulse text-brand-500">|</span>
        </div>
      </div>

      {/* Categories */}
      <div>
        <h3 className="text-sm font-medium mb-4 text-neutral-500 uppercase tracking-wider">
          Category
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {CATEGORIES.slice(0, 8).map((cat) => (
            <button
              key={cat.value}
              onClick={() => toggleCategory(cat.value)}
              className={`rounded-2xl px-4 py-3 transition text-sm ${
                category === cat.value
                  ? "bg-brand-600 text-white"
                  : "bg-neutral-100 dark:bg-neutral-800 hover:bg-brand-500 hover:text-white"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* PRICE */}
      <div>
        <div className="flex justify-between mb-4">
          <h3 className="text-sm font-medium text-neutral-500 uppercase tracking-wider">
            Budget
          </h3>
          <span className="font-semibold text-brand-600 dark:text-brand-300">
            {price >= 300 ? "$300+" : `$${price}`}
          </span>
        </div>
        <input
          type="range"
          min="25"
          max="300"
          step="25"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
          className="w-full accent-brand-600 cursor-pointer"
        />
      </div>

      {/* RATING */}
      <div>
        <h3 className="text-sm font-medium text-neutral-500 uppercase tracking-wider mb-4">
          Rating
        </h3>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((num) => (
            <button
              key={num}
              onClick={() => setRating(num)}
              className="transition hover:scale-125"
            >
              <Star
                size={32}
                className={
                  num <= rating
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-neutral-300"
                }
              />
            </button>
          ))}
        </div>
      </div>

      <button onClick={() => applyFilters()} className="w-full btn-primary">
        Apply filters
      </button>
    </div>
  );
}
