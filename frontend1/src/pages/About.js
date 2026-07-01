export default function About() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8 text-center">About Misty Peaks</h1>

      <div className="bg-white rounded-lg shadow-md p-8 mb-8">
        <h2 className="text-2xl font-semibold mb-4">Our Story</h2>
        <p className="text-gray-600 leading-relaxed mb-4">
          Misty Peaks was born from a passion for mountains and a love for cozy homestays.
          We connect adventurers with breathtaking mountain peaks and comfortable stays,
          creating unforgettable experiences in nature's embrace.
        </p>
        <p className="text-gray-600 leading-relaxed">
          Whether you're a seasoned trekker looking for your next challenge or a traveler
          seeking peace in the mountains, Misty Peaks has something for everyone.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="text-4xl mb-3">🏔️</div>
          <h3 className="font-semibold mb-2">50+ Peaks</h3>
          <p className="text-gray-600 text-sm">Curated mountain peaks with detailed guides and difficulty ratings</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="text-4xl mb-3">🏠</div>
          <h3 className="font-semibold mb-2">30+ Homestays</h3>
          <p className="text-gray-600 text-sm">Handpicked homestays near the most beautiful mountains</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="text-4xl mb-3">👥</div>
          <h3 className="font-semibold mb-2">1000+ Happy Guests</h3>
          <p className="text-gray-600 text-sm">Travelers who trusted us for their mountain adventure</p>
        </div>
      </div>

      <div className="bg-emerald-50 rounded-lg p-8 text-center">
        <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
        <p className="text-gray-600 leading-relaxed max-w-2xl mx-auto">
          To make mountain adventures accessible to everyone while supporting local communities
          and preserving the natural beauty of our mountains.
        </p>
      </div>
    </div>
  );
}
