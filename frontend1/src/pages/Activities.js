const activities = [
  { name: "Trekking", desc: "Explore the rugged terrain of the Western Ghats with guided treks through lush shola forests, grasslands, and mountain trails.", icon: "🥾" },
  { name: "Horse Riding", desc: "Ride through scenic meadows and mountain trails with well-trained horses. A magical experience amidst the clouds.", icon: "🐴" },
  { name: "Jeep Safari", desc: "Thrilling off-road jeep rides through the Kudremukh wildlife corridor. Spot wildlife and experience raw nature.", icon: "🚙" },
  { name: "Camping", desc: "Sleep under a blanket of stars in our premium tented camps. Wake up to misty mountain views.", icon: "⛺" },
  { name: "Campfire", desc: "Warm evenings around the campfire with stories, music, hot chai, and the sound of crickets.", icon: "🔥" },
  { name: "Nature Walk", desc: "Guided walks through spice plantations, coffee estates, and ancient shola forests teeming with life.", icon: "🌿" },
  { name: "Bird Watching", desc: "Over 200 species of birds call Kudremukh home. A birder's paradise with rare endemic species.", icon: "🐦" },
  { name: "Photography", desc: "Capture misty mountains, golden sunrises, vibrant wildlife, and the raw beauty of the Western Ghats.", icon: "📸" },
];

import SEO from "../components/SEO";

export default function Activities() {
  return (
    <div className="bg-forest-950">
      <SEO title="Activities" description="Trekking, horse riding, jeep safari, camping, campfire, nature walks & bird watching at Silent Peak Kudremukh Homestay." />
      <section className="relative h-[50vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1501854140801-50d01698950b?w=1600')] bg-cover bg-center" />
        <div className="absolute inset-0 bg-forest-950/70" />
        <div className="relative z-10 text-center px-4">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-4">Adventure <span className="text-gold-500">Activities</span></h1>
          <p className="text-gray-300 text-lg">Exciting experiences waiting for you</p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-20">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {activities.map((a, i) => (
            <div key={i} className="glass rounded-2xl p-8 text-center gold-border hover-gold transition-all duration-500 hover:scale-105 hover:shadow-[0_0_30px_rgba(212,175,55,0.15)] group cursor-pointer">
              <span className="text-5xl block mb-5 group-hover:scale-125 transition-transform duration-500">{a.icon}</span>
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-gold-500 transition-colors">{a.name}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{a.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
