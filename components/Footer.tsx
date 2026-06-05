export default function Footer() {
  return (
    <footer className="bg-[#1A1A1A] text-gray-400 py-10 px-6">
      <div className="max-w-6xl mx-auto text-center">
        <h3
          className="text-white text-2xl mb-3"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          PREM'S Pencil Sketches
        </h3>

        <p className="mb-6">
          Turning Photos Into Timeless Art
        </p>

        <div className="flex justify-center gap-6 mb-6">
          <a
            href="https://www.instagram.com/premchalase3?igsh=eDh1ZzRpZnlqY3k5"
            target="_blank"
          >
            Instagram
          </a>

          <a
            href="https://wa.me/917760973219"
            target="_blank"
          >
            WhatsApp
          </a>
        </div>

        <p className="text-sm">
          © 2026 PREM'S Pencil Sketches. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}