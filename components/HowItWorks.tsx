import FadeIn from "./FadeIn";
export default function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Send Your Photo",
      description:
        "Share your favorite photo through WhatsApp.",
    },
    {
      number: "02",
      title: "Sketch Creation",
      description:
        "Your portrait is carefully hand-drawn with premium detailing.",
    },
    {
      number: "03",
      title: "Delivered Across India",
      description:
        "Receive your finished artwork safely at your doorstep.",
    },
  ];

  return (
    <FadeIn>
    <section
      id="process"
      className="py-28 px-6 bg-[#F8F5F0]"
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-20">
          <p className="uppercase tracking-[0.3em] text-[#C8A165] text-sm">
            Process
          </p>

          <h2
            className="text-4xl md:text-6xl mt-4"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            How It Works
          </h2>

          <p className="mt-6 text-gray-600 max-w-2xl mx-auto">
            Getting your custom pencil portrait is simple and hassle-free.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step) => (
            <div
              key={step.number}
              className="bg-white rounded-3xl p-10 shadow-sm hover:shadow-lg transition"
            >
              <div className="text-[#C8A165] text-5xl font-bold mb-6">
                {step.number}
              </div>

              <h3 className="text-2xl font-semibold mb-4">
                {step.title}
              </h3>

              <p className="text-gray-600">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
    </FadeIn>
  );
}