import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { homestays } from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const { user } = useAuth();
  const [homestay, setHomestay] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    homestays.getAll().then(({ data }) => {
      if (data.homestays?.length > 0) setHomestay(data.homestays[0]);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const amenities = homestay?.amenities
    ? homestay.amenities.split(",").map((a) => a.trim()).filter(Boolean)
    : ["WiFi", "Parking", "Mountain View", "Home Food", "Bonfire", "Garden"];

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 text-white py-24 md:py-40 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 text-9xl">🏡</div>
          <div className="absolute bottom-10 right-10 text-9xl">🏔️</div>
        </div>
        <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
          <div className="inline-block bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-5 py-2 text-sm text-emerald-200 mb-6">
            Mountain Homestay in Karnataka
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
            Ibbani <span className="text-emerald-300">Homestay</span>
          </h1>
          <p className="text-lg md:text-xl mb-10 text-emerald-100/90 max-w-3xl mx-auto leading-relaxed">
            Wake up to misty mountains, breathe the fresh air of the Western Ghats, and enjoy
            authentic Karnataka hospitality with home-cooked food. Your perfect mountain escape.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            {user ? (
              <Link to="/dashboard" className="bg-white text-emerald-800 px-10 py-4 rounded-xl font-bold hover:bg-emerald-50 transition-all duration-300 transform hover:scale-105 shadow-2xl text-lg">
                Book Your Stay
              </Link>
            ) : (
              <Link to="/register" className="bg-white text-emerald-800 px-10 py-4 rounded-xl font-bold hover:bg-emerald-50 transition-all duration-300 transform hover:scale-105 shadow-2xl text-lg">
                Book Now
              </Link>
            )}
            <a href="#about" className="border-2 border-white/60 px-10 py-4 rounded-xl font-bold hover:bg-white/10 transition-all duration-300 text-lg">
              Learn More
            </a>
          </div>

          <div className="flex justify-center gap-16 mt-16">
            <div className="text-center">
              <p className="text-4xl font-extrabold">4+</p>
              <p className="text-emerald-300 text-sm mt-1 font-medium">Guest Capacity</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-extrabold">⭐</p>
              <p className="text-emerald-300 text-sm mt-1 font-medium">Top Rated</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-extrabold">24/7</p>
              <p className="text-emerald-300 text-sm mt-1 font-medium">Support</p>
            </div>
          </div>
        </div>
      </section>

      {/* About the Homestay */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-emerald-600 font-semibold text-sm uppercase tracking-wider mb-3">About Us</p>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">
                Your Home in the <span className="text-emerald-600">Western Ghats</span>
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Ibbani Homestay is a cozy mountain retreat nestled in the hills of Karnataka. We offer
                a peaceful escape from city life with stunning mountain views, fresh air, and genuine hospitality.
              </p>
              <p className="text-gray-600 leading-relaxed mb-6">
                Every stay includes home-cooked Malnad cuisine, warm hosts, and breathtaking views of
                coffee plantations and mountain peaks. Whether you are a trekker, a nature lover, or just
                looking to relax — this is your perfect getaway.
              </p>
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-emerald-600">₹{homestay?.price_per_night || "120"}</p>
                  <p className="text-gray-500 text-xs">per night</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-emerald-600">{homestay?.max_guests || 4}</p>
                  <p className="text-gray-500 text-xs">guests</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-emerald-600">{homestay?.check_in_time || "12:00"}</p>
                  <p className="text-gray-500 text-xs">check-in</p>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl h-80 md:h-96 flex items-center justify-center text-white text-8xl shadow-2xl relative">
              🏡
              <div className="absolute bottom-4 right-4 bg-white/90 text-emerald-700 px-4 py-2 rounded-full font-bold shadow">
                ₹{homestay?.price_per_night || "120"}/night
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What We Offer */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-14">
            <p className="text-emerald-600 font-semibold text-sm uppercase tracking-wider mb-3">What We Offer</p>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Experience Mountain Living</h2>
            <p className="text-gray-500 max-w-xl mx-auto">Everything you need for a perfect mountain getaway</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 text-center shadow-md hover:shadow-lg transition-all">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-5">
                <span className="text-3xl">🏔️</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Mountain Views</h3>
              <p className="text-gray-600 text-sm">Wake up to misty peaks and breathtaking sunrises over the Western Ghats</p>
            </div>
            <div className="bg-white rounded-2xl p-8 text-center shadow-md hover:shadow-lg transition-all">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-5">
                <span className="text-3xl">🍛</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Home-Cooked Food</h3>
              <p className="text-gray-600 text-sm">Authentic Malnad cuisine prepared with local spices and fresh ingredients</p>
            </div>
            <div className="bg-white rounded-2xl p-8 text-center shadow-md hover:shadow-lg transition-all">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-5">
                <span className="text-3xl">🌿</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Nature Trails</h3>
              <p className="text-gray-600 text-sm">Explore coffee plantations, spice gardens, and scenic trekking paths nearby</p>
            </div>
            <div className="bg-white rounded-2xl p-8 text-center shadow-md hover:shadow-lg transition-all">
              <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-5">
                <span className="text-3xl">🔥</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Bonfire Evenings</h3>
              <p className="text-gray-600 text-sm">Cozy up by the bonfire under the stars with stories and hot chai</p>
            </div>
            <div className="bg-white rounded-2xl p-8 text-center shadow-md hover:shadow-lg transition-all">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-5">
                <span className="text-3xl">☕</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Coffee Estate</h3>
              <p className="text-gray-600 text-sm">Stay amidst working coffee and spice plantations</p>
            </div>
            <div className="bg-white rounded-2xl p-8 text-center shadow-md hover:shadow-lg transition-all">
              <div className="w-16 h-16 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-5">
                <span className="text-3xl">🔒</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Easy Booking</h3>
              <p className="text-gray-600 text-sm">Secure UPI payments and instant booking confirmation</p>
            </div>
          </div>
        </div>
      </section>

      {/* Amenities */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-emerald-600 font-semibold text-sm uppercase tracking-wider mb-3">Amenities</p>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything You Need</h2>
          </div>
          <div className="flex flex-wrap justify-center gap-3 max-w-3xl mx-auto">
            {amenities.map((a, i) => (
              <span key={i} className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-5 py-2.5 rounded-full font-medium">
                {a}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Check-in / Check-out */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-md p-8">
            <h2 className="text-2xl font-bold text-center mb-6">Check-in & Check-out</h2>
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-emerald-50 rounded-xl p-6 text-center border border-emerald-100">
                <p className="text-sm text-gray-500 mb-1">Check-in</p>
                <p className="text-3xl font-bold text-emerald-600">{homestay?.check_in_time || "12:00"}</p>
                <p className="text-xs text-gray-400 mt-1">PM</p>
              </div>
              <div className="bg-orange-50 rounded-xl p-6 text-center border border-orange-100">
                <p className="text-sm text-gray-500 mb-1">Check-out</p>
                <p className="text-3xl font-bold text-orange-600">{homestay?.check_out_time || "11:00"}</p>
                <p className="text-xs text-gray-400 mt-1">AM</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How to Book */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-14">
            <p className="text-emerald-600 font-semibold text-sm uppercase tracking-wider mb-3">Simple Process</p>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How to Book</h2>
            <p className="text-gray-500 max-w-xl mx-auto">Three easy steps to your mountain getaway</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 text-center shadow-md hover:shadow-lg transition-all border border-gray-100">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-5">
                <span className="text-3xl font-bold text-emerald-600">1</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Register</h3>
              <p className="text-gray-600 text-sm">Create your free account in seconds.</p>
            </div>
            <div className="bg-white rounded-2xl p-8 text-center shadow-md hover:shadow-lg transition-all border border-gray-100">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-5">
                <span className="text-3xl font-bold text-emerald-600">2</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Book & Pay</h3>
              <p className="text-gray-600 text-sm">Select your dates and pay securely via UPI.</p>
            </div>
            <div className="bg-white rounded-2xl p-8 text-center shadow-md hover:shadow-lg transition-all border border-gray-100">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-5">
                <span className="text-3xl font-bold text-emerald-600">3</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Enjoy</h3>
              <p className="text-gray-600 text-sm">Arrive, relax, and enjoy the mountains.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-emerald-700 to-teal-700 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready for a Mountain Escape?</h2>
          <p className="text-emerald-100 text-lg mb-8 max-w-2xl mx-auto">
            Book your stay at Ibbani Homestay and experience the best of Karnataka's mountains.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            {user ? (
              <Link to="/dashboard" className="bg-white text-emerald-700 px-10 py-4 rounded-xl font-bold hover:bg-emerald-50 transition-all shadow-lg text-lg">
                Book Now
              </Link>
            ) : (
              <>
                <Link to="/register" className="bg-white text-emerald-700 px-10 py-4 rounded-xl font-bold hover:bg-emerald-50 transition-all shadow-lg text-lg">
                  Get Started Free
                </Link>
                <Link to="/contact" className="border-2 border-white/60 px-10 py-4 rounded-xl font-bold hover:bg-white/10 transition-all text-lg">
                  Talk to Us
                </Link>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
