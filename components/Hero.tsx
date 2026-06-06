export default function Hero() {
  return (
    <section className="min-h-screen pt-32 flex flex-col justify-center items-center text-center px-6">
      <p className="text-sm tracking-[0.3em] uppercase text-[#C8A165]">
        PREM'S PENCIL SKETCHES
      </p>

      <h1
        className="text-5xl md:text-7xl mt-6 leading-tight"
        style={{ fontFamily: "var(--font-playfair)" }}
      >
        Turning Photos
        <br />
        Into Timeless Art
      </h1>

      <p className="max-w-2xl mt-6 text-lg text-gray-600">
        Custom hand-drawn pencil portraits crafted with precision and
        delivered across India.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 mt-10">
        {/* WhatsApp CTA */}
        <a
          href="https://wa.me/917760973219"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-[#C8A165] text-white px-8 py-4 rounded-full hover:scale-105 transition duration-300"
        >
          Order Your Sketch
        </a>

        {/* Scroll to Portfolio */}
        <a
          href="#portfolio"
          className="border border-black px-8 py-4 rounded-full hover:bg-black hover:text-white transition duration-300"
        >
          View Gallery
        </a>
      </div>
    </section>
  );
}