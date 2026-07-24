import SEO from "../components/SEO";

export default function About() {
  return (
    <div className="bg-forest-950">
      <SEO title="About Us" description="Learn about Silent Peak Kudremukh Homestay — a family-run premium retreat nestled in the lush Western Ghats of Karnataka, India." />
      <section className="relative h-[50vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1200&q=80&fit=crop')] bg-cover bg-center" />
        <div className="absolute inset-0 bg-forest-950/70" />
        <div className="relative z-10 text-center px-4">
          <h1 className="text-3xl md:text-5xl lg:text-7xl font-bold text-white mb-4">About <span className="text-gold-500">Us</span></h1>
          <p className="text-gray-300 text-lg">A sanctuary in the Western Ghats</p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 py-20">
        <div className="glass rounded-3xl p-5 md:p-12 gold-border mb-12">
          <h2 className="text-3xl font-bold text-white mb-6">Our <span className="text-gold-500">Story</span></h2>
          <p className="text-gray-400 leading-relaxed mb-4">
            Silent Peak Kudremukh Homestay was born from a deep love for the Western Ghats and the warmth of Karnataka's hospitality. We believe the best travel experiences come from staying with locals, eating home-cooked food, and exploring nature at your own pace.
          </p>
          <p className="text-gray-400 leading-relaxed">
            Nestled among coffee plantations and mountain peaks, Silent Peak offers a peaceful escape from city life. Whether you're a trekker, a nature lover, or someone seeking quiet time — we have a place for you.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {[
            { icon: "🏔️", title: "Mountain Views", desc: "Wake up to misty peaks and fresh mountain air every morning.", color: "emerald" },
            { icon: "🍛", title: "Home Food", desc: "Authentic Malnad cuisine cooked with love and local spices.", color: "amber" },
            { icon: "🌿", title: "Nature", desc: "Explore coffee plantations, trekking trails, and scenic viewpoints.", color: "teal" },
          ].map((item, i) => (
            <div key={i} className="glass rounded-2xl p-6 text-center gold-border hover-gold transition-all duration-500 hover:scale-105 group">
              <span className="text-4xl block mb-4 group-hover:scale-110 transition-transform">{item.icon}</span>
              <h3 className="text-white font-bold mb-2 group-hover:text-gold-500 transition-colors">{item.title}</h3>
              <p className="text-gray-400 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="glass rounded-3xl p-5 md:p-12 gold-border text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Our <span className="text-gold-500">Mission</span></h2>
          <p className="text-gray-400 leading-relaxed max-w-2xl mx-auto">
            To provide an authentic mountain homestay experience that connects guests with nature, local culture, and the warm hospitality of Karnataka's Western Ghats.
          </p>
        </div>
      </div>
    </div>
  );
}
