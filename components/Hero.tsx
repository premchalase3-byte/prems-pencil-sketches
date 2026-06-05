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

      <div className="flex gap-4 mt-10">
        <button className="bg-[#C8A165] text-white px-8 py-4 rounded-full hover:scale-105 transition">
          Order Your Sketch
        </button>

        <button className="border border-black px-8 py-4 rounded-full hover:bg-black hover:text-white transition">
          View Gallery
        </button>
      </div>
    </section>
  );
}
