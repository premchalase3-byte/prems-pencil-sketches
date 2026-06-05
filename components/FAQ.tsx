import FadeIn from "./FadeIn";
export default function FAQ() {
  const faqs = [
    {
      question: "How long does it take to complete a sketch?",
      answer:
        "Most sketches are completed within 3–7 days depending on the size and level of detail.",
    },
    {
      question: "Do you deliver across India?",
      answer:
        "Yes, we deliver custom pencil sketches safely across India.",
    },
    {
      question: "Can I request changes?",
      answer:
        "Yes. A preview can be shared before final delivery, and minor revisions can be requested.",
    },
    {
      question: "Do you draw pets?",
      answer:
        "Absolutely. Pet portraits are one of our most popular requests.",
    },
    {
      question: "Do you offer framing?",
      answer:
        "Framing options can be discussed while placing your order.",
    },
    {
      question: "How do I place an order?",
      answer:
        "Simply click the WhatsApp button and send your photo along with your requirements.",
    },
  ];

  return (
    <FadeIn>
    <section
      id="faq"
      className="py-28 px-6 bg-[#F8F5F0]"
    >
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-20">
          <p className="uppercase tracking-[0.3em] text-[#C8A165] text-sm">
            FAQ
          </p>

          <h2
            className="text-4xl md:text-6xl mt-4"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Frequently Asked Questions
          </h2>

          <p className="mt-6 text-gray-600">
            Everything you need to know before ordering your portrait.
          </p>
        </div>

        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-3xl shadow-sm"
            >
              <h3 className="font-semibold text-xl mb-3">
                {faq.question}
              </h3>

              <p className="text-gray-600">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
    </FadeIn>
  );
}