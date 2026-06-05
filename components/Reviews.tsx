import FadeIn from "./FadeIn";
export default function Reviews() {
  const reviews = [
    {
      name: "Vikas.J",
      city: "Pune",
      review:
        "The sketch was absolutely amazing. Every detail was captured perfectly and it made a wonderful gift.",
    },
    {
      name: "Rani & Sai",
      city: "amsterdam",
      review:
        "I was genuinely impressed by the quality. The artwork looked even better than the photograph.",
    },
    {
      name: "Shreyas.K",
      city: "california",
      review:
        "Smooth communication, fast delivery, and an incredible final sketch. Highly recommended.",
    },
    {
      name: "Shrinivas.S",
      city: "Jamakhandi,karnataka",
      review:
        "The sketch exceeded my expectations. It was beautifully detailed and became one of the most memorable gifts I have ever given.",
    },
    {
      name: "Shrushti",
      city: "Hubli,karnataka",
      review:
        "Excellent craftsmanship and attention to detail. The portrait looked incredibly realistic and was delivered safely on time.",
    },
    {
      name: "Brahmi.K",
      city: "Jamakhandi,karnataka",
      review:
        "I gifted the portrait to my teacher and the reaction was priceless. Amazing work and excellent attention to detail",
    },

  ];

  return (
    <FadeIn>
    <section
      id="reviews"
      className="py-28 px-6 bg-[#F8F5F0]"
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-20">
          <p className="uppercase tracking-[0.3em] text-[#C8A165] text-sm">
            Testimonials
          </p>

          <h2
            className="text-4xl md:text-6xl mt-4"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            What Clients Say
          </h2>

          <p className="mt-6 text-gray-600 max-w-2xl mx-auto">
            Every sketch carries a story. Here is what some of our clients had to say.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {reviews.map((review, index) => (
            <div
              key={index}
              className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-lg transition"
            >
              <div className="text-[#C8A165] text-xl mb-4">
                ★★★★★
              </div>

              <p className="text-gray-600 mb-6 leading-relaxed">
                "{review.review}"
              </p>

              <div>
                <h4 className="font-semibold">
                  {review.name}
                </h4>

                <p className="text-sm text-gray-500">
                  {review.city}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
    </FadeIn>
  );
}