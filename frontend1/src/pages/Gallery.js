import { useState } from "react";
import SEO from "../components/SEO";

const images = [
  { src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600", title: "Misty Mountains", cat: "Sunrise" },
  { src: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=600", title: "Luxury Room", cat: "Rooms" },
  { src: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600", title: "Traditional Cuisine", cat: "Food" },
  { src: "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=600", title: "Golden Sunset", cat: "Sunset" },
  { src: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600", title: "Green Garden", cat: "Garden" },
  { src: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600", title: "Mountain View", cat: "Homestay" },
  { src: "https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?w=600", title: "Night Sky", cat: "Night View" },
  { src: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=600", title: "Valley View", cat: "Homestay" },
  { src: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600", title: "Sunrise Trek", cat: "Sunrise" },
  { src: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600", title: "Spice Garden", cat: "Garden" },
  { src: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=600", title: "Cozy Interior", cat: "Rooms" },
  { src: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600", title: "Dining Area", cat: "Food" },
];

export default function Gallery() {
  const [filter, setFilter] = useState("All");
  const [lightbox, setLightbox] = useState(null);
  const categories = ["All", ...new Set(images.map((i) => i.cat))];
  const filtered = filter === "All" ? images : images.filter((i) => i.cat === filter);

  return (
    <div className="bg-forest-950">
      <SEO title="Gallery" description="Stunning photos of Silent Peak Kudremukh Homestay — misty mountains, luxury rooms, traditional cuisine, and breathtaking landscapes." />
      <section className="relative h-[50vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1600')] bg-cover bg-center" />
        <div className="absolute inset-0 bg-forest-950/70" />
        <div className="relative z-10 text-center px-4">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-4">Our <span className="text-gold-500">Gallery</span></h1>
          <p className="text-gray-300 text-lg">Moments captured at Silent Peak</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((cat) => (
            <button key={cat} onClick={() => setFilter(cat)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                filter === cat ? "bg-gold-500 text-forest-900" : "glass text-gray-400 hover:text-gold-500 gold-border"
              }`}>
              {cat}
            </button>
          ))}
        </div>

        <div className="masonry">
          {filtered.map((img, i) => (
            <div key={i} onClick={() => setLightbox(img)}
              className="group relative rounded-2xl overflow-hidden cursor-pointer gold-border hover-gold transition-all duration-500 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(212,175,55,0.15)]">
              <img src={img.src} alt={img.title} className="w-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" />
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
    </div>
  );
}
