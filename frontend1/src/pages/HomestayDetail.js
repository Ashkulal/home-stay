import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { homestays } from "../services/api";
import { useAuth } from "../context/AuthContext";
import Reviews from "../components/Reviews";

const WHATSAPP = "918660874196";

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
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (!homestay) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-6xl mb-4">🏡</div>
          <h2 className="text-2xl font-bold mb-2">Property not found</h2>
          <Link to="/" className="bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors">
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  const amenitiesList = homestay.amenities
    ? homestay.amenities.split(",").map((a) => a.trim()).filter(Boolean)
    : ["WiFi", "Parking", "Mountain View", "Home Food", "Bonfire"];

  const whatsappMsg = encodeURIComponent(
    `Hi, I'm interested in booking ${homestay.name} at Ibbani Homestay.\nPrice: ₹${homestay.price_per_night}/night\nCheck-in: ${homestay.check_in_time || "12:00"}\nCheck-out: ${homestay.check_out_time || "11:00"}\n\nPlease share availability.`
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 md:py-12">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="h-64 md:h-96 bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-8xl relative">
          🏡
          <div className="absolute top-4 right-4 bg-white/90 text-emerald-700 px-4 py-2 rounded-full font-bold text-lg shadow">
            ₹{homestay.price_per_night}<span className="text-sm font-normal text-gray-500">/night</span>
          </div>
        </div>

        <div className="p-6 md:p-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">{homestay.name}</h1>

          <div className="flex flex-wrap gap-3 mb-6">
            {homestay.max_guests && (
              <span className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-sm font-medium">
                👥 Up to {homestay.max_guests} guests
              </span>
            )}
            {homestay.check_in_time && (
              <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                🕐 Check-in: {homestay.check_in_time}
              </span>
            )}
            {homestay.check_out_time && (
              <span className="bg-orange-50 text-orange-700 px-3 py-1 rounded-full text-sm font-medium">
                🕐 Check-out: {homestay.check_out_time}
              </span>
            )}
          </div>

          {homestay.description && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-2">About this property</h2>
              <p className="text-gray-700 leading-relaxed">{homestay.description}</p>
            </div>
          )}

          {amenitiesList.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-3">Amenities</h2>
              <div className="flex flex-wrap gap-2">
                {amenitiesList.map((a, i) => (
                  <span key={i} className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-sm border border-emerald-100">
                    {a}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Check-in / Check-out */}
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <h2 className="text-lg font-semibold mb-3">Check-in & Check-out</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-lg p-4 text-center border">
                <p className="text-sm text-gray-500">Check-in</p>
                <p className="text-2xl font-bold text-emerald-600">{homestay.check_in_time || "12:00"}</p>
                <p className="text-xs text-gray-400">PM</p>
              </div>
              <div className="bg-white rounded-lg p-4 text-center border">
                <p className="text-sm text-gray-500">Check-out</p>
                <p className="text-2xl font-bold text-orange-600">{homestay.check_out_time || "11:00"}</p>
                <p className="text-xs text-gray-400">AM</p>
              </div>
            </div>
          </div>

          {/* Google Maps */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3">Location</h2>
            {homestay.location_url ? (
              <div className="rounded-xl overflow-hidden border">
                <iframe
                  src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodeURIComponent(homestay.location_url)}`}
                  width="100%"
                  height="350"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Ibbani Homestay Location"
                  className="w-full"
                ></iframe>
              </div>
            ) : (
              <div className="bg-gray-100 rounded-xl p-8 text-center text-gray-500">
                <p>📍 Location map coming soon</p>
              </div>
            )}
            {homestay.location_url && (
              <a href={homestay.location_url} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-3 text-emerald-600 hover:text-emerald-700 font-medium text-sm">
                📌 Open in Google Maps
              </a>
            )}
          </div>

          {/* WhatsApp Inquiry */}
          <div className="bg-green-50 rounded-xl p-4 mb-6 border border-green-100">
            <h2 className="text-lg font-semibold mb-3 text-green-800">Have Questions?</h2>
            <a
              href={`https://wa.me/${WHATSAPP}?text=${whatsappMsg}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
            >
              <span className="text-xl">💬</span>
              Chat on WhatsApp
            </a>
            <p className="text-sm text-gray-500 mt-2">Quick response from our team</p>
          </div>

          {/* Booking / Login CTA */}
          <div className="border-t pt-6">
            {user ? (
              <button
                onClick={() => navigate(`/bookings?homestay=${homestay.id}`)}
                className="bg-emerald-600 text-white px-8 py-4 rounded-lg font-bold hover:bg-emerald-700 transition-all duration-200 transform hover:scale-105 text-lg w-full md:w-auto"
              >
                Book Now — ₹{homestay.price_per_night}/night
              </button>
            ) : (
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <p className="font-semibold text-gray-800 text-lg">Ready to book?</p>
                  <p className="text-gray-500">Login or register to book this property.</p>
                </div>
                <div className="flex gap-3 shrink-0">
                  <Link to="/login" className="bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors">
                    Login
                  </Link>
                  <Link to="/register" className="border-2 border-emerald-600 text-emerald-600 px-6 py-3 rounded-lg font-semibold hover:bg-emerald-50 transition-colors">
                    Register
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-8">
        <Reviews targetType="homestay" targetId={id} />
      </div>
    </div>
  );
}
