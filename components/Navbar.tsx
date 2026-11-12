
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="fixed left-0 right-0 top-0 z-50 bg-[#F8F5F0]/90 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 md:px-6">
        <Link href="/" className="shrink-0">
          <h2
            className="text-xl font-semibold"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            PREM&apos;S
          </h2>
          <p className="text-xs tracking-wider text-gray-500">
            PENCIL SKETCHES
          </p>
        </Link>

        <div className="hidden items-center gap-6 text-sm md:flex">
          <a href="#portfolio" className="transition hover:text-[#C8A165]">
            Portfolio
          </a>
          <a href="#process" className="transition hover:text-[#C8A165]">
            Process
          </a>
          <a href="#pricing" className="transition hover:text-[#C8A165]">
            Pricing
          </a>
          <a href="#reviews" className="transition hover:text-[#C8A165]">
            Reviews
          </a>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/track"
            className="rounded-full border border-[#C8A165] px-3 py-2.5 text-xs font-medium text-[#98713d] transition hover:bg-[#f1e8d9] sm:px-4 sm:text-sm"
          >
            Track Order
          </Link>

          <a
            href="https://wa.me/917760973219"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden rounded-full bg-[#C8A165] px-4 py-3 text-sm text-white transition hover:scale-105 sm:inline-flex"
          >
            Contact Us
          </a>
        </div>
      </div>
    </nav>
  );
}
