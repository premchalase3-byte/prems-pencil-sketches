
import type { Metadata } from "next";
import Link from "next/link";
import TrackOrderForm from "@/components/tracking/TrackOrderForm";

export const metadata: Metadata = {
  title: "Track Your Order | PREM'S Pencil Sketches",
  description:
    "Track your custom pencil sketch order and follow its production progress.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function TrackOrderPage() {
  return (
    <main className="min-h-screen bg-[#f8f5f0] px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <header className="flex items-center justify-between border-b border-[#e8dfd3] pb-6">
          <Link href="/" className="group">
            <span className="block text-2xl font-semibold tracking-wide text-[#292622]">
              PREM&apos;S
            </span>
            <span className="text-[10px] tracking-[0.25em] text-[#8b8175]">
              PENCIL SKETCHES
            </span>
          </Link>

          <Link
            href="/"
            className="text-sm text-[#98713d] transition hover:text-[#70512c]"
          >
            Back to website →
          </Link>
        </header>

        <section className="py-12 text-center sm:py-16">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#b18a52]">
            Your artwork journey
          </p>

          <h1
            className="mt-4 text-3xl font-semibold text-[#292622] sm:text-5xl"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Track Your Artwork
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-[#77716a] sm:text-base">
            From the first outline to the final detailing, follow every
            step of your custom artwork&apos;s journey.
          </p>
        </section>

        <TrackOrderForm />

        <footer className="mt-16 border-t border-[#e8dfd3] py-7 text-center">
          <p className="text-xs text-[#8b8175]">
            Handcrafted with care · PREM&apos;S Pencil Sketches
          </p>
        </footer>
      </div>
    </main>
  );
}
