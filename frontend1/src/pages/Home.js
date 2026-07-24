import { useState } from "react";
import { Link } from "react-router-dom";
import { useToast } from "../components/Toast";
import { contact } from "../services/api";
import SEO from "../components/SEO";

const PHONE = "919481580589";

const peaks = [
  { name: "Kudremukh Peak", desc: "The third highest peak in Karnataka at 1,894m. A breathtaking trek through shola forests and grasslands.", distance: "8 km from homestay", difficulty: "Moderate", bestTime: "Oct - Feb", icon: "🏔️" },
  { name: "Kurinjal Peak", desc: "A pristine peak offering panoramic views of the Western Ghats. Less crowded, more wild.", distance: "12 km", difficulty: "Moderate to Hard", bestTime: "Nov - Jan", icon: "⛰️" },
  { name: "Netravati Peak", desc: "The origin of the Netravati river. A spiritual trek through untouched wilderness.", distance: "15 km", difficulty: "Hard", bestTime: "Oct - Dec", icon: "🌄" },
  { name: "Gangadikal Peak", desc: "Known as the Queen of Kudremukh. Stunning views of rolling green hills as far as the eye can see.", distance: "10 km", difficulty: "Moderate", bestTime: "Sep - Feb", icon: "👑" },
];

const activities = [
  { name: "Trekking", desc: "Explore the rugged terrain of the Western Ghats with guided treks through lush forests.", icon: "🥾" },
  { name: "Horse Riding", desc: "Ride through scenic meadows and mountain trails with well-trained horses.", icon: "🐴" },
  { name: "Jeep Safari", desc: "Thrilling off-road jeep rides through the Kudremukh wildlife corridor.", icon: "🚙" },
  { name: "Camping", desc: "Sleep under a blanket of stars in our premium tented camps.", icon: "⛺" },
  { name: "Campfire", desc: "Warm evenings around the campfire with stories, music, and hot chai.", icon: "🔥" },
  { name: "Nature Walk", desc: "Guided walks through spice plantations, coffee estates, and shola forests.", icon: "🌿" },
  { name: "Bird Watching", desc: "Over 200 species of birds call Kudremukh home. A birder's paradise.", icon: "🐦" },
  { name: "Photography", desc: "Capture misty mountains, golden sunrises, and vibrant wildlife.", icon: "📸" },
];

const attractions = [
  { name: "Hanuman Gundi Falls", desc: "A stunning 100-foot waterfall hidden deep in the forest. A must-visit natural wonder.", distance: "6 km", time: "15 min drive", icon: "💧" },
  { name: "Kudremukh National Park", desc: "UNESCO-listed biodiversity hotspot. Home to tigers, leopards, and rare wildlife.", distance: "10 km", time: "25 min drive", icon: "🐅" },
  { name: "Lakya Dam", desc: "A massive earthen dam surrounded by scenic beauty. Perfect for a peaceful evening visit.", distance: "20 km", time: "40 min drive", icon: "🌊" },
  { name: "Kalasa Temple", desc: "Ancient temple dedicated to Lord Shiva, one of the Ashta Mathas of Madhwacharya.", distance: "25 km", time: "45 min drive", icon: "🛕" },
  { name: "Samse", desc: "A serene village at the base of Kudremukh with stunning views and peaceful walks.", distance: "15 km", time: "30 min drive", icon: "🏡" },
];

const amenities = [
  { name: "Free Wi-Fi", icon: "📶" },
  { name: "Parking", icon: "🅿️" },
  { name: "Hot Water", icon: "🚿" },
  { name: "Garden", icon: "🌳" },
  { name: "Campfire", icon: "🔥" },
  { name: "Family Friendly", icon: "👨‍👩‍👧‍👦" },
  { name: "Mountain View", icon: "🏔️" },
  { name: "Homemade Food", icon: "🍛" },
];

const reviews = [
  { name: "Priya Sharma", rating: 5, text: "An absolute gem in the Western Ghats! The views are breathtaking and the hospitality is unmatched. The homemade food was the best we've ever had. Will definitely come back!", location: "Mumbai" },
  { name: "Rahul Verma", rating: 5, text: "Perfect escape from city life. Woke up to misty mountains every morning. The horse riding and trekking experiences were unforgettable. Highly recommended!", location: "Bangalore" },
  { name: "Ananya Reddy", rating: 5, text: "The campfire evenings were magical. The staff goes above and beyond to make your stay special. Kudremukh is truly paradise and this homestay is the best way to experience it.", location: "Hyderabad" },
];

const galleryImages = [
  { src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=75&fit=crop", title: "Misty Mountains", cat: "Sunrise" },
  { src: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=400&q=75&fit=crop", title: "Luxury Room", cat: "Rooms" },
  { src: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&q=75&fit=crop", title: "Traditional Cuisine", cat: "Food" },
  { src: "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=400&q=75&fit=crop", title: "Golden Sunset", cat: "Sunset" },
  { src: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&q=75&fit=crop", title: "Green Garden", cat: "Garden" },
  { src: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&q=75&fit=crop", title: "Mountain View", cat: "Homestay" },
  { src: "https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?w=400&q=75&fit=crop", title: "Night Sky", cat: "Night View" },
  { src: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400&q=75&fit=crop", title: "Valley View", cat: "Homestay" },
  { src: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&q=75&fit=crop", title: "Sunrise Trek", cat: "Sunrise" },
];

export default function Home() {
  const [galleryFilter, setGalleryFilter] = useState("All");
  const [lightbox, setLightbox] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const categories = ["All", ...new Set(galleryImages.map((i) => i.cat))];
  const filtered = galleryFilter === "All" ? galleryImages : galleryImages.filter((i) => i.cat === galleryFilter);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await contact.submit(form);
      setSubmitted(true);
      setForm({ name: "", email: "", phone: "", message: "" });
      toast.success("Message sent! We'll get back to you soon.");
    } catch {
      toast.error("Failed to send message. Try WhatsApp.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-forest-950">
      <SEO title="Home" description="Premium mountain retreat in Kudremukh, Karnataka. Luxury stays, trekking, horse riding, campfire evenings & breathtaking mountain views in the Western Ghats." />
      {/* Hero */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=75&fit=crop')] bg-cover bg-center" />
        <div className="absolute inset-0 bg-gradient-to-b from-forest-950/70 via-forest-950/50 to-forest-950" />
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <img src="/logo.png" alt="Silent Peak" className="w-32 h-32 md:w-40 md:h-40 mx-auto mb-6 rounded-full border-4 border-gold-500/30 shadow-2xl shadow-gold-500/10 animate-float" />
          <h1 className="text-4xl md:text-6xl lg:text-8xl font-bold text-white mb-4 tracking-tight">
            Silent <span className="text-gold-500">Peak</span>
          </h1>
          <p className="text-gold-500/70 tracking-[0.4em] text-sm md:text-base mb-6 uppercase">Kudremukh Homestay</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="tel:+919481580589"
              className="group flex items-center justify-center gap-3 bg-gold-500 text-forest-900 px-6 py-4 sm:px-10 rounded-full font-bold text-lg hover:bg-gold-400 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(212,175,55,0.3)]">
              <span className="text-2xl group-hover:animate-bounce">📞</span> Call Now
            </a>
            <a href={`https://wa.me/${PHONE}?text=Hi%2C%20I%27m%20interested%20in%20Silent%20Peak%20Kudremukh%20Homestay`}
              target="_blank" rel="noopener noreferrer"
              className="group flex items-center justify-center gap-3 bg-green-600 text-white px-6 py-4 sm:px-10 rounded-full font-bold text-lg hover:bg-green-500 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(34,197,94,0.3)]">
              <span className="text-2xl group-hover:animate-bounce">💬</span> WhatsApp
            </a>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce text-gold-500/50 text-3xl">▼</div>
      </section>

      {/* About */}
      <section className="section-padding relative">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 md:gap-16 items-center">
            <div>
              <p className="text-gold-500 font-bold text-sm tracking-[0.3em] uppercase mb-3">About Us</p>
              <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
                Your Sanctuary in the <span className="text-gold-500">Western Ghats</span>
              </h2>
              <p className="text-gray-400 leading-relaxed mb-4">
                Silent Peak Kudremukh Homestay is a premium mountain retreat nestled among the rolling green hills of Kudremukh. We offer a peaceful escape from city life with stunning mountain views, fresh air, and genuine hospitality.
              </p>
              <p className="text-gray-400 leading-relaxed mb-8">
                Every stay includes home-cooked Malnad cuisine prepared with local spices, warm hosts, and breathtaking views of the Western Ghats. Whether you're a trekker, a nature lover, or just looking to unwind — this is your perfect getaway.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {["Mountain View", "Comfortable Rooms", "Homemade Food", "Campfire", "Free Parking", "Free Wi-Fi"].map((f) => (
                  <div key={f} className="flex items-center gap-2">
                    <span className="text-gold-500">✦</span>
                    <span className="text-gray-300 text-sm">{f}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="glass rounded-3xl overflow-hidden gold-border gold-glow">
                <img src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80&fit=crop" alt="Silent Peak" width="800" height="600" className="w-full h-96 object-cover" />
              </div>
              <div className="absolute -bottom-6 -left-6 glass rounded-2xl p-4 gold-border">
                <p className="text-gold-500 font-bold text-2xl">4.9 ★</p>
                <p className="text-gray-400 text-xs">200+ Reviews</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="section-padding bg-forest-900/30">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-gold-500 font-bold text-sm tracking-[0.3em] uppercase mb-3">Gallery</p>
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white">Visual Stories</h2>
          </div>
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {categories.map((cat) => (
              <button key={cat} onClick={() => setGalleryFilter(cat)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  galleryFilter === cat
                    ? "bg-gold-500 text-forest-900"
                    : "glass text-gray-400 hover:text-gold-500 gold-border"
                }`}>
                {cat}
              </button>
            ))}
          </div>
          <div className="masonry">
            {filtered.map((img, i) => (
              <div key={i} onClick={() => setLightbox(img)}
                className="group relative rounded-2xl overflow-hidden cursor-pointer gold-border hover-gold transition-all duration-500 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(212,175,55,0.15)]">
                <img src={img.src} alt={img.title} width="400" height="300" className="w-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-forest-950/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-4">
                  <div>
                    <p className="text-white font-bold">{img.title}</p>
                    <p className="text-gold-500 text-sm">{img.cat}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {lightbox && (
        <div className="fixed inset-0 z-[100] bg-forest-950/95 flex items-center justify-center p-4" onClick={() => setLightbox(null)}>
          <button className="absolute top-6 right-6 text-white text-3xl hover:text-gold-500 transition-colors">✕</button>
          <img src={lightbox.src} alt={lightbox.title} className="max-w-full max-h-[85vh] rounded-2xl shadow-2xl gold-border" onClick={(e) => e.stopPropagation()} />
          <div className="absolute bottom-8 text-center">
            <p className="text-white text-xl font-bold">{lightbox.title}</p>
            <p className="text-gold-500">{lightbox.cat}</p>
          </div>
        </div>
      )}

      {/* Peaks */}
      <section className="section-padding">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <p className="text-gold-500 font-bold text-sm tracking-[0.3em] uppercase mb-3">Explore</p>
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-4">Kudremukh Peaks</h2>
            <p className="text-gray-400 max-w-xl mx-auto">Discover the majestic peaks of the Western Ghats</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {peaks.map((p, i) => (
              <div key={i} className="glass rounded-2xl p-6 gold-border hover-gold transition-all duration-500 hover:shadow-[0_0_30px_rgba(212,175,55,0.1)] group">
                <div className="flex items-start gap-4">
                  <span className="text-4xl group-hover:scale-110 transition-transform">{p.icon}</span>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-1 group-hover:text-gold-500 transition-colors">{p.name}</h3>
                    <p className="text-gray-400 text-sm mb-3">{p.desc}</p>
                    <div className="flex flex-wrap gap-2">
                      <span className="glass text-xs text-gold-500 px-3 py-1 rounded-full gold-border">📍 {p.distance}</span>
                      <span className="glass text-xs text-gray-400 px-3 py-1 rounded-full">{p.difficulty}</span>
                      <span className="glass text-xs text-green-400 px-3 py-1 rounded-full">🌤 {p.bestTime}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Activities */}
      <section className="section-padding bg-forest-900/30">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <p className="text-gold-500 font-bold text-sm tracking-[0.3em] uppercase mb-3">Adventures</p>
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-4">Activities</h2>
            <p className="text-gray-400 max-w-xl mx-auto">Exciting experiences waiting for you</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {activities.map((a, i) => (
              <div key={i} className="glass rounded-2xl p-6 text-center gold-border hover-gold transition-all duration-500 hover:scale-105 hover:shadow-[0_0_30px_rgba(212,175,55,0.1)] group cursor-pointer">
                <span className="text-4xl block mb-4 group-hover:scale-125 transition-transform duration-500">{a.icon}</span>
                <h3 className="text-white font-bold mb-2 group-hover:text-gold-500 transition-colors">{a.name}</h3>
                <p className="text-gray-400 text-sm">{a.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Nearby Attractions */}
      <section className="section-padding">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <p className="text-gold-500 font-bold text-sm tracking-[0.3em] uppercase mb-3">Discover</p>
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-4">Nearby Attractions</h2>
            <p className="text-gray-400 max-w-xl mx-auto">Explore the wonders around Kudremukh</p>
          </div>
          <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-5">
            {attractions.map((a, i) => (
              <div key={i} className="glass rounded-2xl p-5 gold-border hover-gold transition-all duration-500 hover:scale-105 hover:shadow-[0_0_30px_rgba(212,175,55,0.1)] group">
                <span className="text-3xl block mb-3 group-hover:scale-110 transition-transform">{a.icon}</span>
                <h3 className="text-white font-bold mb-1 text-sm group-hover:text-gold-500 transition-colors">{a.name}</h3>
                <p className="text-gray-400 text-xs mb-2">{a.desc}</p>
                <div className="flex gap-2">
                  <span className="text-[10px] text-gold-500 glass px-2 py-0.5 rounded-full gold-border">📍 {a.distance}</span>
                  <span className="text-[10px] text-gray-400 glass px-2 py-0.5 rounded-full">🕐 {a.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Amenities */}
      <section className="section-padding bg-forest-900/30">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <p className="text-gold-500 font-bold text-sm tracking-[0.3em] uppercase mb-3">Comfort</p>
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-4">Amenities</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {amenities.map((a, i) => (
              <div key={i} className="glass rounded-2xl p-6 text-center gold-border hover-gold transition-all duration-300 hover:scale-105 group">
                <span className="text-4xl block mb-3 group-hover:scale-110 transition-transform">{a.icon}</span>
                <p className="text-white font-bold text-sm group-hover:text-gold-500 transition-colors">{a.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="section-padding">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <p className="text-gold-500 font-bold text-sm tracking-[0.3em] uppercase mb-3">Testimonials</p>
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-4">Guest Reviews</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {reviews.map((r, i) => (
              <div key={i} className="glass rounded-2xl p-6 gold-border hover-gold transition-all duration-500 hover:shadow-[0_0_30px_rgba(212,175,55,0.1)]">
                <div className="text-gold-500 text-lg mb-3">{"★".repeat(r.rating)}</div>
                <p className="text-gray-300 text-sm leading-relaxed mb-4 italic">"{r.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gold-500/20 flex items-center justify-center text-gold-500 font-bold text-sm">
                    {r.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-white font-bold text-sm">{r.name}</p>
                    <p className="text-gray-500 text-xs">{r.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="section-padding bg-forest-900/30">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-gold-500 font-bold text-sm tracking-[0.3em] uppercase mb-3">Get in Touch</p>
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-4">Contact Us</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="glass rounded-2xl p-5 md:p-8 gold-border">
              <h3 className="text-xl font-bold text-white mb-6">Send a Message</h3>
              {submitted ? (
                <div className="text-center py-12">
                  <p className="text-gold-500 text-lg font-bold mb-2">✓ Thank you!</p>
                  <p className="text-gray-400">We'll get back to you within 24 hours.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <input type="text" placeholder="Your Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full bg-white border border-gold-500/20 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-gold-500 focus:outline-none transition-colors" required />
                  <input type="email" placeholder="Email Address" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full bg-white border border-gold-500/20 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-gold-500 focus:outline-none transition-colors" required />
                  <input type="tel" placeholder="Phone Number" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full bg-white border border-gold-500/20 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-gold-500 focus:outline-none transition-colors" />
                  <textarea placeholder="Your Message" rows="4" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full bg-white border border-gold-500/20 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-gold-500 focus:outline-none transition-colors resize-none" required />
                  <button type="submit" disabled={loading}
                    className="w-full bg-gold-500 text-forest-900 py-3 rounded-xl font-bold hover:bg-gold-400 transition-all disabled:opacity-50">
                    {loading ? "Sending..." : "Send Message"}
                  </button>
                </form>
              )}
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <a href="tel:+919481580589"
                  className="glass rounded-2xl p-6 text-center gold-border hover:bg-gold-500 hover:text-forest-900 transition-all duration-300 group">
                  <span className="text-3xl block mb-2 group-hover:scale-110 transition-transform">📞</span>
                  <p className="font-bold text-white group-hover:text-forest-900 text-sm">Call Now</p>
                  <p className="text-gray-400 text-xs mt-1 group-hover:text-forest-800">+91 94815 80589</p>
                </a>
                <a href={`https://wa.me/${PHONE}?text=Hi%2C%20I%27m%20interested%20in%20Silent%20Peak%20Homestay`}
                  target="_blank" rel="noopener noreferrer"
                  className="glass rounded-2xl p-6 text-center border border-green-500/30 hover:bg-green-600 transition-all duration-300 group">
                  <span className="text-3xl block mb-2 group-hover:scale-110 transition-transform">💬</span>
                  <p className="font-bold text-white text-sm">WhatsApp</p>
                  <p className="text-gray-400 text-xs mt-1">Chat with us</p>
                </a>
              </div>

              <div className="glass rounded-2xl p-6 gold-border space-y-4">
                <div className="flex items-center gap-3 text-gray-300 text-sm">
                  <span>👤</span> <span>Mahesh — Owner</span>
                </div>
                <div className="flex items-center gap-3 text-gray-300 text-sm">
                  <span>📞</span> <a href="tel:+919481580589" className="hover:text-gold-500 transition-colors">+91 94815 80589</a>
                </div>
                <div className="flex items-center gap-3 text-gray-300 text-sm">
                  <span>📍</span> <span>Hosmata, Samse, Kudremukh, Kalasa, Chikkamagaluru, Karnataka – 577124</span>
                </div>
                <div className="flex items-center gap-3 text-gray-300 text-sm">
                  <span>🌐</span> <a href="https://www.silentpeakkudremukh.co.in" target="_blank" rel="noopener noreferrer" className="hover:text-gold-500 transition-colors">silentpeakkudremukh.co.in</a>
                </div>
              </div>

              <div className="glass rounded-2xl overflow-hidden gold-border">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3885.2!2d75.27!3d13.22!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTPCsDEzJzEyLjAiTiA3NcKwMTYnMTIuMCJF!5e0!3m2!1sen!2sin!4v1234567890"
                  width="100%" height="200" style={{ border: 0 }} allowFullScreen="" loading="lazy"
                  title="Silent Peak Location" className="w-full" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="section-padding relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=75&fit=crop')] bg-cover bg-center opacity-20" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-4xl lg:text-6xl font-bold text-white mb-6">
            Ready for Your Mountain <span className="text-gold-500">Escape?</span>
          </h2>
          <p className="text-gray-400 text-lg mb-10 max-w-2xl mx-auto">
            Book your stay at Silent Peak Kudremukh and experience the magic of the Western Ghats.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a href="tel:+919481580589"
              className="bg-gold-500 text-forest-900 px-6 py-4 sm:px-10 rounded-full font-bold text-lg hover:bg-gold-400 transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(212,175,55,0.3)]">
              📞 Call Now
            </a>
            <a href={`https://wa.me/${PHONE}?text=Hi%2C%20I%27d%20like%20to%20book%20Silent%20Peak%20Kudremukh`}
              target="_blank" rel="noopener noreferrer"
              className="bg-green-600 text-white px-6 py-4 sm:px-10 rounded-full font-bold text-lg hover:bg-green-500 transition-all hover:scale-105">
              💬 WhatsApp Us
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
