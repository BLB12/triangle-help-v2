import Link from "next/link";
import { CheckCircle } from "lucide-react";

export default function SuccessPage({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="card p-10 max-w-md text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
          <CheckCircle size={32} className="text-green-600" />
        </div>
        <h1 className="text-2xl font-bold mb-2">You're live!</h1>
        <p className="text-neutral-500 text-sm mb-6">
          Your service listing has been activated and is now visible to everyone in the Triangle area.
        </p>
        <div className="flex gap-3 justify-center">
          <Link href={`/listings/${params.id}`} className="btn-primary">View Your Listing</Link>
          <Link href="/dashboard" className="btn-secondary">Dashboard</Link>
        </div>
      </div>
    </div>
  );
}
