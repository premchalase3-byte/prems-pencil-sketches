import FadeIn from "./FadeIn";
export default function Stats() {
  return (
    <FadeIn>
    <section className="py-20 bg-[#EFE8DD]">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 text-center">
          <div>
            <h3 className="text-4xl font-bold">100+</h3>
            <p className="mt-2 text-gray-600">Portraits Created</p>
          </div>

          <div>
            <h3 className="text-4xl font-bold">4.9★</h3>
            <p className="mt-2 text-gray-600">Customer Rating</p>
          </div>

          <div>
            <h3 className="text-4xl font-bold">2</h3>
            <p className="mt-2 text-gray-600">International Orders</p>
          </div>

          <div>
            <h3 className="text-4xl font-bold">6+</h3>
            <p className="mt-2 text-gray-600">Cities Served</p>
          </div>

          <div>
            <h3 className="text-4xl font-bold">100%</h3>
            <p className="mt-2 text-gray-600">Handmade Artwork</p>
          </div>
        </div>
      </div>
    </section>
    </FadeIn>
  );
}