export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#F8F5F0]/90 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-5 flex items-center justify-between">
        
        {/* Brand Name */}
        <div>
          <h2
            className="text-xl font-semibold"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            PREM'S
          </h2>

          <p className="text-xs tracking-wider text-gray-500">
            PENCIL SKETCHES
          </p>
        </div>

        {/* Navigation Links */}
        <div className="hidden md:flex gap-8 text-sm">
          <a
            href="#portfolio"
            className="hover:text-[#C8A165] transition"
          >
            Portfolio
          </a>

          <a
            href="#process"
            className="hover:text-[#C8A165] transition"
          >
            Process
          </a>

          <a
            href="#pricing"
            className="hover:text-[#C8A165] transition"
          >
            Pricing
          </a>

          <a
            href="#reviews"
            className="hover:text-[#C8A165] transition"
          >
            Reviews
          </a>
        </div>

        {/* WhatsApp Button */}
        <a
          href="https://wa.me/917760973219"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-[#C8A165] text-white px-5 py-3 rounded-full text-sm hover:scale-105 transition"
        >
          WhatsApp
        </a>
      </div>
    </nav>
  );
}