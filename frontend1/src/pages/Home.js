import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div>
      <section className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-32 animate-fade-in">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6 animate-slide-down">Explore Misty Peaks</h1>
          <p className="text-xl mb-8 text-emerald-100 animate-slide-up">
            Discover breathtaking mountain peaks and cozy homestays
          </p>
          <div className="flex justify-center gap-4 animate-slide-up">
            <Link to="/peaks" className="bg-white text-emerald-600 px-6 py-3 rounded-lg font-semibold hover:bg-emerald-50 transition-all duration-300 transform hover:scale-105">
              View Peaks
            </Link>
            <Link to="/homestays" className="border-2 border-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-emerald-600 transition-all duration-300 transform hover:scale-105">
              View Homestays
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Us</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 transform hover:-translate-y-1">
              <div className="text-4xl mb-4">🏔️</div>
              <h3 className="text-xl font-semibold mb-2">Amazing Peaks</h3>
              <p className="text-gray-600">Explore the most beautiful mountain peaks with detailed guides</p>
            </div>
            <div className="text-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 transform hover:-translate-y-1">
              <div className="text-4xl mb-4">🏠</div>
              <h3 className="text-xl font-semibold mb-2">Cozy Homestays</h3>
              <p className="text-gray-600">Stay in comfortable homestays near the mountains</p>
            </div>
            <div className="text-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 transform hover:-translate-y-1">
              <div className="text-4xl mb-4">📸</div>
              <h3 className="text-xl font-semibold mb-2">Gallery</h3>
              <p className="text-gray-600">Share and explore stunning mountain photography</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-8">Ready for Your Adventure?</h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of happy travelers who explored the mountains with Misty Peaks
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/register" className="bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-all duration-300 transform hover:scale-105">
              Get Started
            </Link>
            <Link to="/contact" className="border-2 border-emerald-600 text-emerald-600 px-6 py-3 rounded-lg font-semibold hover:bg-emerald-50 transition-all duration-300">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
