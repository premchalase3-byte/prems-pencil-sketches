"use client";

import FadeIn from "./FadeIn";
import {
  ReactCompareSlider,
  ReactCompareSliderImage,
} from "react-compare-slider";

export default function BeforeAfter() {
  return (
    <FadeIn>
      <section
        id="before-after"
        className="py-28 px-6 bg-[#EFE8DD]"
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="uppercase tracking-[0.3em] text-[#C8A165] text-sm">
              Transformation
            </p>

            <h2
              className="text-4xl md:text-6xl mt-4"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Photo To Pencil Sketch
            </h2>

            <p className="mt-6 text-gray-600 max-w-2xl mx-auto">
              Drag the slider to compare the original photograph
              with the final handmade pencil artwork.
            </p>
          </div>

          <div className="max-w-4xl mx-auto overflow-hidden rounded-3xl shadow-xl">
            <ReactCompareSlider
              itemOne={
                <ReactCompareSliderImage
                  src="/before-after/photo.jpg.jpeg"
                  alt="Original Photo"
                />
              }
              itemTwo={
                <ReactCompareSliderImage
                  src="/before-after/sketch.jpg.jpeg"
                  alt="Pencil Sketch"
                />
              }
            />
          </div>
        </div>
      </section>
    </FadeIn>
  );
}