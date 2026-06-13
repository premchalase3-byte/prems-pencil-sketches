"use client";

import { useEffect, useState } from "react";

export default function ChallengePopup() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setOpen(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-[99999] flex items-center justify-center px-4">
      <div className="relative bg-white rounded-[40px] p-10 max-w-xl w-full text-center shadow-2xl">

        {/* Close Button */}
        <button
          onClick={() => setOpen(false)}
          className="absolute top-5 right-6 text-gray-500 hover:text-black text-2xl"
        >
          ×
        </button>

        <p className="uppercase tracking-[0.35em] text-gray-600 text-sm">
          Coming Soon
        </p>

        <h2
          className="text-4xl md:text-5xl mt-6 leading-tight"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          FREE 10-Day Portrait
          <br />
          Sketch Challenge
        </h2>

        <p className="mt-6 text-gray-600 text-lg">
          Learn portrait sketching, earn points,
          and compete for a FREE 1-on-1 sketching class.
        </p>

        <div className="mt-10">
          <a
            href="/challenge"
            className="inline-block bg-[#C8A165] text-white px-10 py-4 rounded-full hover:scale-105 transition duration-300"
          >
            Reserve My Spot
          </a>
        </div>

      </div>
    </div>
  );
}