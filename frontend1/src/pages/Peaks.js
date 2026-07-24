const peaks = [
  { name: "Kudremukh Peak", desc: "The third highest peak in Karnataka at 1,894m. A breathtaking trek through shola forests, grasslands, and misty trails. The name literally means 'horse face' in Kannada, referring to the shape of the peak.", distance: "8 km from homestay", difficulty: "Moderate", bestTime: "Oct - Feb", elevation: "1,894m", img: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80&fit=crop" },
  { name: "Kurinjal Peak", desc: "A pristine peak offering panoramic views of the Western Ghats. Less crowded and more wild, this trek takes you through dense forests and open meadows with stunning 360-degree views.", distance: "12 km", difficulty: "Moderate to Hard", bestTime: "Nov - Jan", elevation: "1,501m", img: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80&fit=crop" },
  { name: "Netravati Peak", desc: "The origin of the Netravati river, one of the major rivers of Karnataka. A spiritual trek through untouched wilderness, waterfalls, and pristine shola forests.", distance: "15 km", difficulty: "Hard", bestTime: "Oct - Dec", elevation: "1,720m", img: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&q=80&fit=crop" },
  { name: "Gangadikal Peak", desc: "Known as the Queen of Kudremukh. Stunning views of rolling green hills as far as the eye can see. One of the most scenic treks in the Western Ghats.", distance: "10 km", difficulty: "Moderate", bestTime: "Sep - Feb", elevation: "1,631m", img: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&q=80&fit=crop" },
];

import SEO from "../components/SEO";

export default function Peaks() {
  return (
    <div className="bg-forest-950">
      <SEO title="Peaks & Trekking" description="Explore Kudremukh Peak, Kurinjal, Netravati & Gangadikal — the best trekking peaks in the Western Ghats near Kudremukh, Karnataka." />
      <section className="relative h-[50vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-forest-950 via-[#0a1f0a] to-forest-900" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.06)_0%,transparent_70%)]" />
        <div className="relative z-10 text-center px-4">
          <h1 className="text-3xl md:text-5xl lg:text-7xl font-bold text-white mb-4">Kudremukh <span className="text-gold-500">Peaks</span></h1>
          <p className="text-gray-300 text-lg">Discover the majestic peaks of the Western Ghats</p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-20 space-y-8">
        {peaks.map((p, i) => (
          <div key={i} className={`glass rounded-3xl overflow-hidden gold-border hover-gold transition-all duration-500 hover:shadow-[0_0_40px_rgba(212,175,55,0.1)] flex flex-col ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}>
            <div className="md:w-1/2">
              <img src={p.img} alt={p.name} width="800" height="600" className="w-full h-72 md:h-full object-cover" loading="lazy" />
            </div>
            <div className="md:w-1/2 p-8 flex flex-col justify-center">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-3 hover:text-gold-500 transition-colors">{p.name}</h2>
              <p className="text-gray-400 text-sm leading-relaxed mb-4">{p.desc}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="glass text-xs text-gold-500 px-3 py-1 rounded-full gold-border">📍 {p.distance}</span>
                <span className="glass text-xs text-gray-400 px-3 py-1 rounded-full">⛰️ {p.elevation}</span>
                <span className="glass text-xs text-orange-400 px-3 py-1 rounded-full">📊 {p.difficulty}</span>
                <span className="glass text-xs text-green-400 px-3 py-1 rounded-full">🌤 {p.bestTime}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
