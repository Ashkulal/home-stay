import { Link } from "react-router-dom";

export default function About() {
  return (
    <div>
      <section className="bg-gradient-to-br from-emerald-700 to-teal-700 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">About Ibbani Homestay</h1>
          <p className="text-emerald-100 text-lg max-w-2xl mx-auto">
            A cozy mountain retreat in the heart of Karnataka
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold mb-4">Our Story</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            Ibbani Homestay was born from a deep love for the Western Ghats and the warmth of Karnataka's homestay culture.
            We believe that the best travel experiences come from staying with locals, eating home-cooked food, and exploring nature at your own pace.
          </p>
          <p className="text-gray-600 leading-relaxed">
            Nestled among coffee plantations and mountain peaks, Ibbani Homestay offers a peaceful escape from city life.
            Whether you are a trekker, a nature lover, or someone seeking quiet time — we have a place for you.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-md p-6 text-center">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🏔️</span>
            </div>
            <h3 className="font-bold mb-2">Mountain Views</h3>
            <p className="text-gray-600 text-sm">Wake up to misty peaks and fresh mountain air every morning</p>
          </div>
          <div className="bg-white rounded-2xl shadow-md p-6 text-center">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🍛</span>
            </div>
            <h3 className="font-bold mb-2">Home Food</h3>
            <p className="text-gray-600 text-sm">Authentic Malnad cuisine cooked with love and local spices</p>
          </div>
          <div className="bg-white rounded-2xl shadow-md p-6 text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🌿</span>
            </div>
            <h3 className="font-bold mb-2">Nature</h3>
            <p className="text-gray-600 text-sm">Explore coffee plantations, trekking trails, and scenic viewpoints</p>
          </div>
        </div>

        <div className="bg-emerald-50 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
          <p className="text-gray-600 leading-relaxed max-w-2xl mx-auto mb-6">
            To provide an authentic mountain homestay experience that connects guests with nature,
            local culture, and the warm hospitality of Karnataka.
          </p>
          <Link to="/register" className="inline-block bg-emerald-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors">
            Book Your Stay
          </Link>
        </div>
      </div>
    </div>
  );
}
