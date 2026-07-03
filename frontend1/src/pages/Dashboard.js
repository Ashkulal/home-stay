import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { bookings } from "../services/api";

const WHATSAPP = "918660874196";

export default function Dashboard() {
  const { user } = useAuth();
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    bookings.getAll().then(({ data }) => {
      setList(data.bookings);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const pending = list.filter((b) => b.status === "pending");
  const confirmed = list.filter((b) => b.status === "confirmed");
  const totalSpent = list
    .filter((b) => b.status === "confirmed")
    .reduce((sum, b) => sum + (parseFloat(b.total_amount) || 0), 0);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 md:py-12">
      {/* Welcome Card */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-2xl shadow-lg p-6 md:p-8 mb-8">
        <div className="flex items-center gap-4">
          <span className="bg-white/20 w-14 h-14 rounded-full flex items-center justify-center font-bold text-2xl">
            {user.name?.charAt(0).toUpperCase()}
          </span>
          <div>
            <h1 className="text-2xl font-bold">Welcome, {user.name}!</h1>
            <p className="text-emerald-100">{user.email}</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl shadow-md p-5 text-center border border-gray-100">
          <p className="text-3xl font-extrabold text-emerald-600">{list.length}</p>
          <p className="text-sm text-gray-500 mt-1">Total Bookings</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-5 text-center border border-gray-100">
          <p className="text-3xl font-extrabold text-amber-600">{pending.length}</p>
          <p className="text-sm text-gray-500 mt-1">Pending</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-5 text-center border border-gray-100">
          <p className="text-3xl font-extrabold text-green-600">{confirmed.length}</p>
          <p className="text-sm text-gray-500 mt-1">Confirmed</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-5 text-center border border-gray-100">
          <p className="text-3xl font-extrabold text-emerald-600">₹{totalSpent}</p>
          <p className="text-sm text-gray-500 mt-1">Total Spent</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        <Link to="/bookings" className="bg-white rounded-xl shadow-md p-5 hover:shadow-lg transition-all border border-gray-100 text-center group">
          <div className="text-3xl mb-2">📋</div>
          <p className="font-bold group-hover:text-emerald-600 transition-colors">My Bookings</p>
          <p className="text-gray-400 text-sm">View & manage stays</p>
        </Link>
        <Link to="/homestays" className="bg-white rounded-xl shadow-md p-5 hover:shadow-lg transition-all border border-gray-100 text-center group">
          <div className="text-3xl mb-2">🏡</div>
          <p className="font-bold group-hover:text-emerald-600 transition-colors">Browse Stays</p>
          <p className="text-gray-400 text-sm">Find your next escape</p>
        </Link>
        <a href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noopener noreferrer"
          className="bg-white rounded-xl shadow-md p-5 hover:shadow-lg transition-all border border-gray-100 text-center group">
          <div className="text-3xl mb-2">💬</div>
          <p className="font-bold group-hover:text-emerald-600 transition-colors">WhatsApp Us</p>
          <p className="text-gray-400 text-sm">Chat with our team</p>
        </a>
      </div>

      {/* Recent Bookings */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold">Recent Bookings</h2>
          {list.length > 0 && (
            <Link to="/bookings" className="text-emerald-600 font-semibold text-sm hover:text-emerald-700">View All →</Link>
          )}
        </div>

        {loading ? (
          <div className="text-center py-10">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
          </div>
        ) : list.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-400 mb-4">No bookings yet</p>
            <Link to="/homestays" className="bg-emerald-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-emerald-700 transition-colors">
              Book Your First Stay
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {list.slice(0, 5).map((b) => (
              <div key={b.id} className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-lg">🏡</div>
                  <div>
                    <p className="font-semibold">{b.homestay_name}</p>
                    <p className="text-sm text-gray-400">
                      {new Date(b.check_in).toLocaleDateString("en-IN", { day: "numeric", month: "short" })} — {new Date(b.check_out).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                      {b.total_amount && <span className="ml-2 text-emerald-600 font-bold">₹{b.total_amount}</span>}
                    </p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  b.status === "confirmed" ? "bg-green-100 text-green-700" :
                  b.status === "pending" ? "bg-amber-100 text-amber-700" :
                  b.status === "cancelled" ? "bg-red-100 text-red-600" :
                  "bg-gray-100 text-gray-600"
                }`}>
                  {b.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
