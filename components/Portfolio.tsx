"use client";
import FadeIn from "./FadeIn";
import { useState } from "react";

const sketches = [
  { image: "/portfolio/sketch1.jpg.jpeg" },
  { image: "/portfolio/sketch2.jpg.jpeg" },
  { image: "/portfolio/sketch3.jpg.png" },
  { image: "/portfolio/sketch4.jpg.png" },
  { image: "/portfolio/sketch5.jpg.png" },
  { image: "/portfolio/sketch6.jpg.png" },
  { image: "/portfolio/sketch7.jpg.png" },
  { image: "/portfolio/sketch8.jpg.jpeg" },
];

export default function Portfolio() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <FadeIn>
    <section
      id="portfolio"
      className="py-28 px-6 max-w-7xl mx-auto"
    >
      {/* Heading */}
      <div className="text-center mb-16">
        <p className="uppercase tracking-[0.3em] text-[#C8A165] text-sm">
          Portfolio
        </p>

        <h2
          className="text-4xl md:text-6xl mt-4"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          Featured Sketches
        </h2>

        <p className="mt-6 text-gray-600 max-w-2xl mx-auto">
          Every portrait is hand-drawn with attention to detail,
          emotion, and realism.
        </p>
      </div>

      {/* Masonry Gallery */}
      <div className="columns-1 md:columns-2 lg:columns-3 gap-6">
        {sketches.map((item, index) => (
          <div
            key={index}
            onClick={() => setSelectedImage(item.image)}
            className="mb-6 break-inside-avoid overflow-hidden rounded-3xl bg-white shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer"
          >
            <img
              src={item.image}
              alt="Custom handmade pencil sketch portrait by Prem"
              className="w-full h-auto transition-transform duration-700 hover:scale-105"
            />
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="text-center mt-16">
        <a
          href="https://wa.me/917760973219"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-[#C8A165] text-white px-8 py-4 rounded-full hover:scale-105 transition duration-300"
        >
          Get Your Portrait
        </a>
      </div>

      {/* Fullscreen Lightbox */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/95 z-[9999] flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-6 right-8 text-white text-5xl hover:scale-110 transition"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedImage(null);
            }}
          >
            ×
          </button>

          <img
            src={selectedImage}
            alt="Preview"
            className="max-w-[95vw] max-h-[90vh] object-contain rounded-xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </section>
    </FadeIn>
  );
}