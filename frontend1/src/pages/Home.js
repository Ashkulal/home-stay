import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { peaks, homestays } from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ peaks: 0, homestays: 0 });

  useEffect(() => {
    Promise.all([peaks.getAll(), homestays.getAll()]).then(([p, h]) => {
      setStats({ peaks: p.data.peaks?.length || 0, homestays: h.data.homestays?.length || 0 });
    }).catch(() => {});
  }, []);

  return (
    <div>
      <section className="bg-gradient-to-br from-emerald-700 via-emerald-600 to-teal-700 text-white py-20 md:py-36 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
          <p className="text-emerald-200 uppercase tracking-widest text-sm mb-4 font-medium">Welcome to</p>
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Ibbani Stay
          </h1>
          <p className="text-lg md:text-xl mb-10 text-emerald-100 max-w-2xl mx-auto">
            Experience the beauty of Karnataka's mountains. Book cozy homestays, explore breathtaking peaks, and create memories that last a lifetime.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/homestays" className="bg-white text-emerald-700 px-8 py-4 rounded-lg font-bold hover:bg-emerald-50 transition-all duration-300 transform hover:scale-105 shadow-lg">
              Book Your Stay
            </Link>
            <Link to="/peaks" className="border-2 border-white px-8 py-4 rounded-lg font-bold hover:bg-white hover:text-emerald-700 transition-all duration-300 shadow-lg">
              Explore Peaks
            </Link>
          </div>
          {stats.homestays > 0 && (
            <div className="flex justify-center gap-12 mt-14">
              <div className="text-center">
                <p className="text-3xl font-bold">{stats.homestays}</p>
                <p className="text-emerald-200 text-sm">Properties</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold">{stats.peaks}</p>
                <p className="text-emerald-200 text-sm">Peaks</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold">24/7</p>
                <p className="text-emerald-200 text-sm">Support</p>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">Why Ibbani Stay</h2>
          <p className="text-gray-500 text-center mb-12 max-w-xl mx-auto">Handpicked stays with authentic mountain hospitality</p>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🏔️</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Mountain Peaks</h3>
              <p className="text-gray-600">Explore guided treks to the most stunning peaks in Karnataka</p>
            </div>
            <div className="text-center p-8 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🏡</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Cozy Homestays</h3>
              <p className="text-gray-600">Authentic homestays with home-cooked food and warm hospitality</p>
            </div>
            <div className="text-center p-8 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🔒</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Easy Booking</h3>
              <p className="text-gray-600">Secure UPI payments and instant booking confirmation</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Plan Your Mountain Getaway</h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Whether it's a weekend escape or a week-long adventure, Ibbani Stay has the perfect homestay for you.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            {user ? (
              <Link to="/homestays" className="bg-emerald-600 text-white px-8 py-4 rounded-lg font-bold hover:bg-emerald-700 transition-all duration-300 transform hover:scale-105 shadow-lg">
                Browse Stays
              </Link>
            ) : (
              <>
                <Link to="/register" className="bg-emerald-600 text-white px-8 py-4 rounded-lg font-bold hover:bg-emerald-700 transition-all duration-300 transform hover:scale-105 shadow-lg">
                  Get Started
                </Link>
                <Link to="/contact" className="border-2 border-emerald-600 text-emerald-600 px-8 py-4 rounded-lg font-bold hover:bg-emerald-50 transition-all duration-300">
                  Contact Us
                </Link>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
