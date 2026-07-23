import { useState, useEffect } from "react";
import { gallery } from "../services/api";

export default function Gallery() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    gallery.getAll()
      .then(({ data }) => setImages(data.images))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center py-16">Loading...</div>;

  return (
    <div>
      <section className="bg-gradient-to-br from-emerald-700 to-teal-700 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Gallery</h1>
          <p className="text-emerald-100 text-lg">Moments captured at Misty Peaks</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {images.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">📸</div>
            <p className="text-gray-500 text-lg">No photos yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {images.map((img) => (
              <div key={img._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <img src={img.image_url} alt={img.title} className="w-full h-48 object-cover" />
                <div className="p-4">
                  <h3 className="font-semibold">{img.title}</h3>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
