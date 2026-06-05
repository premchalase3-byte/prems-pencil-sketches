import FadeIn from "./FadeIn";
export default function About() {
  return (
    <FadeIn>
    <section
      id="about"
      className="py-28 px-6 bg-[#EFE8DD]"
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          
          {/* Artist Image */}
          <div>
            <img
              src="/prem.jpeg"
              alt="Prem"
              className="w-full rounded-3xl shadow-lg"
            />
          </div>

          {/* Content */}
          <div>
            <p className="uppercase tracking-[0.3em] text-[#C8A165] text-sm">
              Meet The Artist
            </p>

            <h2
              className="text-4xl md:text-6xl mt-4 mb-8"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Hi, I'm Prem
            </h2>

            <p className="text-gray-600 leading-relaxed mb-6">
              I am a passionate pencil sketch artist who loves transforming
              meaningful photographs into timeless handmade artwork.
            </p>

            <p className="text-gray-600 leading-relaxed mb-6">
              Every portrait is carefully hand-drawn with attention to detail,
              emotion, and realism. My goal is to create artwork that people
              can cherish for years and proudly display in their homes.
            </p>

            <p className="text-gray-600 leading-relaxed">
              Whether it's a gift for a loved one, a wedding memory,
              a family portrait, or a pet sketch, every artwork is created
              with dedication and care.
            </p>
          </div>
        </div>
      </div>
    </section>
    </FadeIn>
  );
}