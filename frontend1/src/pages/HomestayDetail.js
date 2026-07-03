import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { homestays } from "../services/api";
import { useAuth } from "../context/AuthContext";
import Reviews from "../components/Reviews";

export default function HomestayDetail() {
  const [homestay, setHomestay] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    homestays.getOne(id).then(({ data }) => {
      setHomestay(data.homestay);
      setLoading(false);
    }).catch(() => {
      setHomestay(null);
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return (
      <div className="text-center py-16">
        <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600 mb-3"></div>
        <p className="text-gray-500">Loading homestay...</p>
      </div>
    );
  }

  if (!homestay) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-6xl mb-4">🏠</div>
          <h2 className="text-2xl font-bold mb-2">Homestay not found</h2>
          <p className="text-gray-500 mb-6">The homestay you're looking for doesn't exist.</p>
          <Link to="/homestays" className="bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors">
            Browse Homestays
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="h-64 md:h-80 bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white text-8xl">
          🏠
        </div>
        <div className="p-6 md:p-8">
          <h1 className="text-2xl md:text-4xl font-bold mb-2">{homestay.name}</h1>
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <p className="text-emerald-600 text-2xl font-bold">₹{homestay.price_per_night}<span className="text-sm font-normal text-gray-500">/night</span></p>
            {homestay.max_guests && (
              <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                👥 Max {homestay.max_guests} guests
              </span>
            )}
          </div>
          {homestay.description && (
            <p className="text-gray-700 mt-4 leading-relaxed">{homestay.description}</p>
          )}

          <div className="mt-8 border-t pt-6">
            {user ? (
              <button
                onClick={() => navigate(`/bookings?homestay=${homestay.id}`)}
                className="bg-emerald-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-all duration-200 transform hover:scale-105"
              >
                Book Now
              </button>
            ) : (
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-gray-50 rounded-lg p-4">
                <div>
                  <p className="font-semibold text-gray-800">Want to book this homestay?</p>
                  <p className="text-sm text-gray-500">Login or create an account to make a reservation.</p>
                </div>
                <div className="flex gap-3 shrink-0">
                  <Link to="/login" className="bg-emerald-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-emerald-700 transition-colors text-sm">
                    Login
                  </Link>
                  <Link to="/register" className="border border-emerald-600 text-emerald-600 px-5 py-2 rounded-lg font-medium hover:bg-emerald-50 transition-colors text-sm">
                    Register
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Reviews targetType="homestay" targetId={id} />
    </div>
  );
}
