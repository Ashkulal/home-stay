import { useState, useEffect } from "react";
import { homestays } from "../services/api";

const WHATSAPP = "919481580589";

export default function Home() {
  const [homestay, setHomestay] = useState(null);

  useEffect(() => {
    homestays.getAll().then(({ data }) => {
      if (data.homestays?.length > 0) setHomestay(data.homestays[0]);
    }).catch(() => {});
  }, []);

  const amenities = homestay?.amenities
    ? homestay.amenities.split(",").map((a) => a.trim()).filter(Boolean)
    : ["WiFi", "Parking", "Mountain View", "Home Food", "Bonfire", "Garden"];

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-emerald-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iLjAzIj48cGF0aCBkPSJNMzYgMzRoLTJ2LTRoMnYtMmgtNHY2aDJ2Mmgydi0yek0yMiAxOGgtMnYtMmgydjJNMzAgMTBoLTJ2Mmgwdi0yek0xOCAyNGgtMnY0aDJ2LTRNMjYgMjhoLTJ2NGgydi00Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30"></div>
        <div className="max-w-7xl mx-auto px-4 py-28 md:py-40 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 text-sm text-emerald-300 mb-8">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
              Western Ghats, Karnataka
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-[1.1] tracking-tight">
              Escape to the<br />
              <span className="text-emerald-400">Misty Mountains</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 mb-10 leading-relaxed max-w-xl">
              A premium mountain homestay nestled among coffee plantations. Wake up to breathtaking sunrises, breathe the fresh air, and experience authentic Karnataka hospitality.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href={`https://wa.me/${WHATSAPP}?text=Hi%2C%20I%27m%20interested%20in%20Misty%20Peaks%20Homestay`}
                target="_blank" rel="noopener noreferrer"
                className="bg-emerald-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-900/30 text-center">
                Book via WhatsApp
              </a>
              <a href={`https://wa.me/${WHATSAPP}?text=Hi%2C%20I%27d%20like%20to%20know%20more%20about%20Misty%20Peaks`}
                target="_blank" rel="noopener noreferrer"
                className="border border-white/30 px-8 py-4 rounded-xl font-bold hover:bg-white/10 transition-all text-center">
                Talk to Us
              </a>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-gray-50 to-transparent"></div>
      </section>

      {/* Stats Bar */}
      <section className="relative -mt-8 z-20 max-w-5xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 grid grid-cols-2 md:grid-cols-4 gap-6 border border-gray-100">
          <div className="text-center">
            <p className="text-xl font-bold text-emerald-600">₹1,500</p>
            <p className="text-gray-500 text-xs mt-1">per person / night</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-extrabold text-emerald-600">{homestay?.max_guests || 4}+</p>
            <p className="text-gray-500 text-sm mt-1">guests capacity</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-extrabold text-emerald-600">{homestay?.check_in_time || "12:00"}</p>
            <p className="text-gray-500 text-sm mt-1">check-in time</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-extrabold text-emerald-600">{homestay?.check_out_time || "11:00"}</p>
            <p className="text-gray-500 text-sm mt-1">check-out time</p>
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-emerald-600 font-semibold text-sm uppercase tracking-wider mb-3">About Us</p>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">
                Your Home in the<br />Western Ghats
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Misty Peaks is a premium mountain retreat nestled in the hills of Karnataka, surrounded by working coffee and spice plantations. We offer a peaceful escape from city life with stunning mountain views, fresh air, and genuine hospitality.
              </p>
              <p className="text-gray-600 leading-relaxed mb-8">
                Every stay includes home-cooked Malnad cuisine prepared with local ingredients, warm hosts, and breathtaking views of the Western Ghats. Whether you are a trekker, a nature lover, or just looking to unwind — this is your perfect getaway.
              </p>
              <div className="flex flex-wrap gap-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <span className="font-medium text-gray-700">Verified Listing</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <span className="font-medium text-gray-700">Home-Cooked Food</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <span className="font-medium text-gray-700">Mountain Views</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-3xl h-80 md:h-[28rem] flex items-center justify-center shadow-2xl overflow-hidden">
                <div className="text-center text-white">
                  <div className="text-8xl mb-4">🏔️</div>
                  <p className="text-2xl font-bold">Misty Peaks</p>
                  <p className="text-emerald-200 mt-1">Western Ghats, Karnataka</p>
                </div>
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-xl p-4 border border-gray-100 hidden md:block">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Starting from</p>
                    <p className="text-lg font-bold text-emerald-600">₹1,500 <span className="text-sm font-normal text-gray-400">/night</span></p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What We Offer */}
      <section className="py-20 md:py-28 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <p className="text-emerald-600 font-semibold text-sm uppercase tracking-wider mb-3">Experience</p>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What Awaits You</h2>
            <p className="text-gray-500 max-w-xl mx-auto">Everything you need for an unforgettable mountain retreat</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: "🏔️", title: "Mountain Views", desc: "Wake up to misty peaks and breathtaking sunrises over the Western Ghats from your window." },
              { icon: "🍛", title: "Home-Cooked Food", desc: "Authentic Malnad cuisine prepared with local spices and fresh ingredients from our garden." },
              { icon: "🌿", title: "Nature Trails", desc: "Explore coffee plantations, spice gardens, and scenic trekking paths right from our doorstep." },
              { icon: "🔥", title: "Bonfire Evenings", desc: "Cozy up by the bonfire under the stars with stories and hot chai on cool mountain nights." },
              { icon: "☕", title: "Coffee Estate", desc: "Stay amidst working coffee and spice plantations. Learn about coffee cultivation." },
              { icon: "📞", title: "Easy Booking", desc: "Contact us via WhatsApp or the form below. Quick response and personalised assistance." },
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-2xl p-8 hover:shadow-lg transition-all duration-300 border border-gray-100 group">
                <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mb-5 group-hover:bg-emerald-100 transition-colors">
                  <span className="text-2xl">{item.icon}</span>
                </div>
                <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Amenities + Check-in/out */}
      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <p className="text-emerald-600 font-semibold text-sm uppercase tracking-wider mb-3">Amenities</p>
              <h2 className="text-3xl font-bold mb-8">Everything You Need</h2>
              <div className="grid grid-cols-2 gap-3">
                {amenities.map((a, i) => (
                  <div key={i} className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3 border border-gray-100">
                    <svg className="w-5 h-5 text-emerald-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    <span className="font-medium text-gray-700">{a}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="text-emerald-600 font-semibold text-sm uppercase tracking-wider mb-3">Timings</p>
              <h2 className="text-3xl font-bold mb-8">Check-in & Check-out</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-emerald-50 rounded-2xl p-6 text-center border border-emerald-100">
                  <p className="text-sm text-gray-500 mb-2">Check-in</p>
                  <p className="text-4xl font-extrabold text-emerald-600">{homestay?.check_in_time || "12:00"}</p>
                  <p className="text-xs text-gray-400 mt-2">PM</p>
                </div>
                <div className="bg-orange-50 rounded-2xl p-6 text-center border border-orange-100">
                  <p className="text-sm text-gray-500 mb-2">Check-out</p>
                  <p className="text-4xl font-extrabold text-orange-600">{homestay?.check_out_time || "11:00"}</p>
                  <p className="text-xs text-gray-400 mt-2">AM</p>
                </div>
              </div>
              <div className="mt-4 bg-gray-50 rounded-xl p-4 border border-gray-100">
                <p className="text-sm text-gray-500">Need early check-in or late check-out? <a href={`https://wa.me/${WHATSAPP}?text=Hi%2C%20can%20I%20get%20early%20check-in%20or%20late%20check-out%3F`} target="_blank" rel="noopener noreferrer" className="text-emerald-600 font-semibold hover:underline">Contact us</a></p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-28 bg-gradient-to-br from-gray-900 via-gray-800 to-emerald-900 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Ready for a Mountain Escape?</h2>
          <p className="text-gray-300 text-lg mb-10 max-w-2xl mx-auto">
            Get in touch with us to plan your stay at Misty Peaks. Starting at just ₹1,500 per person per night.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a href={`https://wa.me/${WHATSAPP}?text=Hi%2C%20I%27d%20like%20to%20book%20Misty%20Peaks`}
              target="_blank" rel="noopener noreferrer"
              className="bg-emerald-600 text-white px-10 py-4 rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-lg text-lg">
              WhatsApp Us
            </a>
            <a href="/contact"
              className="border border-white/30 px-10 py-4 rounded-xl font-bold hover:bg-white/10 transition-all text-lg">
              Send a Message
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
