export default function About() {
  return (
    <div>
      <section className="bg-gradient-to-br from-emerald-700 to-teal-700 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">About Ibbani Stay</h1>
          <p className="text-emerald-100 text-lg max-w-2xl mx-auto">
            Your gateway to Karnataka's stunning mountain landscapes
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold mb-4">Our Story</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            Ibbani Stay was born from a deep love for the Western Ghats and the warmth of Karnataka's homestay culture.
            We believe that the best travel experiences come from staying with locals, eating home-cooked food, and exploring nature at your own pace.
          </p>
          <p className="text-gray-600 leading-relaxed">
            From the misty peaks of Coorg to the rolling hills of Chikmagalur, we curate the finest homestays that offer
            authentic mountain hospitality. Whether you're a trekker, a nature lover, or someone seeking peace — Ibbani Stay is your home in the mountains.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-md p-6 text-center">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🏔️</span>
            </div>
            <h3 className="font-bold mb-2">Curated Peaks</h3>
            <p className="text-gray-600 text-sm">Detailed guides, difficulty ratings, and routes for every trekker</p>
          </div>
          <div className="bg-white rounded-2xl shadow-md p-6 text-center">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🏡</span>
            </div>
            <h3 className="font-bold mb-2">Handpicked Stays</h3>
            <p className="text-gray-600 text-sm">Every homestay is personally visited and verified for quality</p>
          </div>
          <div className="bg-white rounded-2xl shadow-md p-6 text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🤝</span>
            </div>
            <h3 className="font-bold mb-2">Local Support</h3>
            <p className="text-gray-600 text-sm">24/7 support and local tips from our mountain community</p>
          </div>
        </div>

        <div className="bg-emerald-50 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
          <p className="text-gray-600 leading-relaxed max-w-2xl mx-auto">
            To make mountain getaways accessible to everyone while supporting local communities
            and preserving the natural beauty of Karnataka's mountains.
          </p>
        </div>
      </div>
    </div>
  );
}
