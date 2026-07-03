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
      <section className="bg-gradient-to-br from-emerald-700 via-emerald-600 to-teal-600 text-white py-20 md:py-36 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 text-9xl">🏔️</div>
          <div className="absolute bottom-10 right-10 text-9xl">🏠</div>
        </div>
        <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-slide-down">
            Discover Misty Peaks
          </h1>
          <p className="text-lg md:text-xl mb-10 text-emerald-100 max-w-2xl mx-auto animate-slide-up">
            Explore breathtaking mountain peaks and stay in cozy homestays. Your adventure starts here.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 animate-slide-up">
            <Link to="/peaks" className="bg-white text-emerald-700 px-8 py-4 rounded-lg font-bold hover:bg-emerald-50 transition-all duration-300 transform hover:scale-105 shadow-lg">
              Explore Peaks
            </Link>
            <Link to="/homestays" className="border-2 border-white px-8 py-4 rounded-lg font-bold hover:bg-white hover:text-emerald-700 transition-all duration-300 shadow-lg">
              Find Homestays
            </Link>
          </div>
          {stats.peaks > 0 && (
            <div className="flex justify-center gap-12 mt-12 animate-slide-up">
              <div className="text-center">
                <p className="text-3xl font-bold">{stats.peaks}</p>
                <p className="text-emerald-200 text-sm">Peaks</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold">{stats.homestays}</p>
                <p className="text-emerald-200 text-sm">Homestays</p>
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
          <h2 className="text-3xl font-bold text-center mb-4">Why Choose Misty Peaks</h2>
          <p className="text-gray-500 text-center mb-12 max-w-xl mx-auto">Everything you need for the perfect mountain getaway</p>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🏔️</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Amazing Peaks</h3>
              <p className="text-gray-600">Explore the most beautiful mountain peaks with detailed guides and routes</p>
            </div>
            <div className="text-center p-8 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🏠</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Cozy Homestays</h3>
              <p className="text-gray-600">Stay in comfortable, verified homestays near the mountains</p>
            </div>
            <div className="text-center p-8 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🔒</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Secure Booking</h3>
              <p className="text-gray-600">Safe and secure UPI payments with instant confirmation</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready for Your Adventure?</h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Join travelers who explored the mountains with Misty Peaks
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            {user ? (
              <Link to="/dashboard" className="bg-emerald-600 text-white px-8 py-4 rounded-lg font-bold hover:bg-emerald-700 transition-all duration-300 transform hover:scale-105 shadow-lg">
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link to="/register" className="bg-emerald-600 text-white px-8 py-4 rounded-lg font-bold hover:bg-emerald-700 transition-all duration-300 transform hover:scale-105 shadow-lg">
                  Get Started Free
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
