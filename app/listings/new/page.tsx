"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CATEGORIES } from "@/lib/utils";
import { CreditCard, CheckCircle } from "lucide-react";

export default function NewListingPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [step, setStep] = useState(1); // 1: form, 2: payment
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    price: "",
    priceType: "HOURLY",
    city: "",
    zipCode: "",
  });

  function update(key: string, val: string) {
    setForm((f) => ({ ...f, [key]: val }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!session) { router.push("/login"); return; }
    setLoading(true);
    setError("");

    // Create listing, then redirect to Stripe
    const res = await fetch("/api/listings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    if (!res.ok) { setError(data.error ?? "Failed to create listing."); setLoading(false); return; }

    // Redirect to Stripe Checkout
    const stripeRes = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ listingId: data.id }),
    });

    const stripeData = await stripeRes.json();
    if (stripeData.url) {
      window.location.href = stripeData.url;
    } else {
      setError("Payment setup failed. Try again.");
      setLoading(false);
    }
  }

  if (!session) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold mb-3">List Your Service</h1>
        <p className="text-neutral-500 mb-6">You need an account to post a service listing.</p>
        <div className="flex gap-3 justify-center">
          <Link href="/login" className="btn-secondary">Sign In</Link>
          <Link href="/signup" className="btn-primary">Create Free Account</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">List Your Service</h1>
        <p className="text-neutral-500 text-sm mt-1">One-time listing fee of $9.99. Your service goes live after payment.</p>
      </div>

      {/* Fee callout */}
      <div className="bg-brand-50 border border-brand-100 rounded-2xl p-4 mb-6 flex items-center gap-3">
        <CreditCard size={20} className="text-brand-600 shrink-0" />
        <div>
          <p className="text-sm font-medium text-brand-800">$9.99 listing fee</p>
          <p className="text-xs text-brand-600">Paid securely via Stripe after filling out your listing info.</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 text-sm px-4 py-3 rounded-xl mb-5 border border-red-100">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="card p-6 space-y-5">
        <div>
          <label className="label">Service title</label>
          <input className="input" placeholder="e.g. Expert Lawn Mowing & Edging" value={form.title} onChange={(e) => update("title", e.target.value)} required />
        </div>

        <div>
          <label className="label">Description</label>
          <textarea className="input min-h-[100px] resize-none" placeholder="Describe what you offer, your experience, availability..." value={form.description} onChange={(e) => update("description", e.target.value)} required rows={4} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Category</label>
            <select className="input" value={form.category} onChange={(e) => update("category", e.target.value)} required>
              <option value="">Select category</option>
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Price type</label>
            <select className="input" value={form.priceType} onChange={(e) => update("priceType", e.target.value)}>
              <option value="HOURLY">Per hour</option>
              <option value="FLAT">Flat rate</option>
              <option value="STARTING_AT">Starting at</option>
            </select>
          </div>
        </div>

        <div>
          <label className="label">Your price ($)</label>
          <input className="input" type="number" placeholder="25" min="1" value={form.price} onChange={(e) => update("price", e.target.value)} required />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">City</label>
            <input className="input" placeholder="Raleigh" value={form.city} onChange={(e) => update("city", e.target.value)} required />
          </div>
          <div>
            <label className="label">ZIP code</label>
            <input className="input" placeholder="27601" value={form.zipCode} onChange={(e) => update("zipCode", e.target.value)} required />
          </div>
        </div>

        <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3 text-base">
          {loading ? "Setting up payment..." : "Continue to Payment — $9.99"}
        </button>
      </form>
    </div>
  );
}
