import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { homestays } from "../services/api";
import { useAuth } from "../context/AuthContext";
import Reviews from "../components/Reviews";

export default function HomestayDetail() {
  const [homestay, setHomestay] = useState(null);
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    homestays.getOne(id).then(({ data }) => setHomestay(data.homestay)).catch(() => setHomestay(null));
  }, [id]);

  if (!homestay) return <div className="text-center py-16">
    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
    <p className="mt-2 text-gray-500">Loading...</p>
  </div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="h-64 bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white text-8xl">
          🏠
        </div>
        <div className="p-8">
          <h1 className="text-4xl font-bold mb-4">{homestay.name}</h1>
          <p className="text-emerald-600 text-2xl font-bold mb-2">₹{homestay.price_per_night}/night</p>
          {homestay.max_guests && <p className="text-gray-500 mb-4">Max guests: {homestay.max_guests}</p>}
          {homestay.description && <p className="text-gray-700 mt-4">{homestay.description}</p>}
          {user && (
            <button
              onClick={() => navigate(`/bookings?homestay=${homestay.id}`)}
              className="mt-6 bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors duration-200"
            >
              Book Now
            </button>
          )}
        </div>
      </div>
      <Reviews targetType="homestay" targetId={id} />
    </div>
  );
}
