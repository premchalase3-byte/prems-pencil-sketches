export default function CTA() {
  return (
    <section className="py-32 px-6 bg-[#222222] text-white">
      <div className="max-w-4xl mx-auto text-center">
        <p className="uppercase tracking-[0.3em] text-[#C8A165] text-sm">
          Ready To Order?
        </p>

        <h2
          className="text-4xl md:text-6xl mt-6 mb-8"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          Turn Your Favorite
          <br />
          Photo Into Art
        </h2>

        <p className="text-gray-300 max-w-2xl mx-auto mb-10">
          Handmade pencil portraits crafted with care and delivered
          across India.
        </p>

        <a
          href="https://wa.me/917760973219"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-[#C8A165] text-white px-10 py-5 rounded-full text-lg hover:scale-105 transition"
        >
          Order On WhatsApp
        </a>

        <div className="mt-12 flex flex-col md:flex-row justify-center gap-8 text-sm text-gray-400">
          <span>✓ Handmade Artwork</span>
          <span>✓ Delivered Across India</span>
          <span>✓ Premium Quality</span>
        </div>
      </div>
    </section>
  );
}