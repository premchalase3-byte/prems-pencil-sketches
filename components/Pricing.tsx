import FadeIn from "./FadeIn";
export default function Pricing() {
  const plans = [
    {
      size: "A4",
      price: "₹1099",
      features: [
        "Handmade Pencil Sketch",
        "Premium Quality Paper",
        "Perfect For Personal Portraits",
        "Delivered Across India",
        "With frame",
      ],
    },
    {
      size: "A3",
      price: "₹1899",
      featured: true,
      features: [
        "Most Popular Choice",
        "Larger Premium Artwork",
        "Highly Detailed Shading",
        "Perfect For Gifts & Framing",
        "Delivered Across India",
        "With frame",
      ],
    },
  ];

  return (
    <FadeIn>
    <section
      id="pricing"
      className="py-28 px-6 bg-[#EFE8DD]"
    >
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-20">
          <p className="uppercase tracking-[0.3em] text-[#C8A165] text-sm">
            Pricing
          </p>

          <h2
            className="text-4xl md:text-6xl mt-4"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Choose Your Portrait Size
          </h2>

          <p className="mt-6 text-gray-600 max-w-2xl mx-auto">
            Premium handmade Charcoal pencil sketches crafted with care and
            delivered across India.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`rounded-3xl p-10 bg-white shadow-sm hover:shadow-xl transition ${
                plan.featured
                  ? "border-2 border-[#C8A165] scale-105"
                  : ""
              }`}
            >
              {plan.featured && (
                <div className="mb-6 inline-block bg-[#C8A165] text-white text-sm px-4 py-2 rounded-full">
                  Most Popular
                </div>
              )}

              <h3 className="text-3xl font-semibold mb-2">
                {plan.size}
              </h3>

              <div className="text-5xl font-bold mb-8">
                {plan.price}
              </div>

              <ul className="space-y-4 mb-10">
                {plan.features.map((feature, i) => (
                  <li key={i} className="text-gray-600">
                    ✓ {feature}
                  </li>
                ))}
              </ul>

              <a
                href="https://wa.me/917760973219"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center bg-[#C8A165] text-white py-4 rounded-full hover:scale-105 transition"
              >
                Order Now
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
    </FadeIn>
  );
}