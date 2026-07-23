"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  ArrowUp,
  SlidersHorizontal,
} from "lucide-react";

import { CATEGORIES } from "@/lib/utils";

export function SmartSearch() {
  const router = useRouter();

  const examples = [
    "pet sitting",
    "child care",
    "lawn maintenance",
    "house cleaning",
    "help moving",
    "computer repair",
  ];

  const [placeholder, setPlaceholder] = useState("");
  const [index, setIndex] = useState(0);
  const [query, setQuery] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [city, setCity] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  useEffect(() => {
    let current = 0;
    let deleting = false;

    const timer = setInterval(() => {
      const word = examples[index];

      if (!deleting) {
        setPlaceholder(word.slice(0, current + 1));
        current++;
        if (current === word.length) deleting = true;
      } else {
        setPlaceholder(word.slice(0, current - 1));
        current--;
        if (current === 0) {
          deleting = false;
          setIndex((prev) => (prev + 1) % examples.length);
        }
      }
    }, 120);

    return () => clearInterval(timer);
  }, [index]);

  function runSearch() {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (city) params.set("city", city);
    if (maxPrice) params.set("maxPrice", maxPrice);
    router.push(`/search?${params.toString()}`);
  }

  function goToCategory(value: string) {
    router.push(`/search?category=${value}`);
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="relative rounded-[32px] bg-white dark:bg-neutral-900 border border-black/10 dark:border-white/10 shadow-[0_30px_80px_rgba(0,0,0,.12)] p-3">
        <div className="flex items-center gap-4 px-5 py-4">
          <Sparkles size={22} className="text-brand-600 dark:text-brand-300 shrink-0" />

          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && runSearch()}
            placeholder={`Find help with ${placeholder}`}
            className="flex-1 bg-transparent text-lg text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-500 outline-none"
          />

          <button
            onClick={runSearch}
            className="w-11 h-11 rounded-full bg-brand-600 text-white flex items-center justify-center hover:scale-105 transition"
            aria-label="Search"
          >
            <ArrowUp size={20} />
          </button>
        </div>
      </div>

      {/* QUICK ACTIONS */}
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        {CATEGORIES.slice(0, 8).map((cat) => (
          <button
            key={cat.value}
            onClick={() => goToCategory(cat.value)}
            className="px-5 py-2.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-sm hover:bg-brand-600 hover:text-white transition"
          >
            {cat.label}
          </button>
        ))}
      </div>

      <button
        onClick={() => setShowAdvanced((prev) => !prev)}
        className="mt-6 mx-auto flex items-center gap-2 text-sm text-neutral-500 hover:text-brand-600 transition"
      >
        <SlidersHorizontal size={15} />
        Advanced preferences
      </button>

      {showAdvanced && (
        <div className="mt-4 mx-auto max-w-md rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-neutral-900 p-5 flex flex-col gap-4">
          <div>
            <label className="block text-xs text-neutral-500 mb-1">City</label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Raleigh, Durham, Chapel Hill…"
              className="w-full rounded-lg border border-black/10 dark:border-white/10 bg-transparent px-3 py-2 text-sm outline-none focus:border-brand-500"
            />
          </div>

          <div>
            <label className="block text-xs text-neutral-500 mb-1">Max price</label>
            <input
              type="number"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              placeholder="e.g. 50"
              className="w-full rounded-lg border border-black/10 dark:border-white/10 bg-transparent px-3 py-2 text-sm outline-none focus:border-brand-500"
            />
          </div>

          <button onClick={runSearch} className="btn-primary w-full justify-center">
            Apply filters
          </button>
        </div>
      )}
    </div>
  );
}
