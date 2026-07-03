import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { bookings } from "../services/api";

export default function Dashboard() {
  const { user } = useAuth();
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    bookings.getAll().then(({ data }) => {
      setList(data.bookings);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const activeBookings = list.filter((b) => b.status === "confirmed" || b.status === "pending");
  const pastBookings = list.filter((b) => b.status === "completed" || b.status === "cancelled");

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="bg-white rounded-xl shadow-md p-6 md:p-8 mb-8">
        <div className="flex items-center gap-4">
          <span className="bg-emerald-100 text-emerald-700 w-14 h-14 rounded-full flex items-center justify-center font-bold text-2xl">
            {user.name?.charAt(0).toUpperCase()}
          </span>
          <div>
            <h1 className="text-2xl font-bold">Welcome back, {user.name}!</h1>
            <p className="text-gray-500">{user.email}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl shadow-md p-4 text-center">
          <p className="text-2xl font-bold text-emerald-600">{list.length}</p>
          <p className="text-sm text-gray-500">Total Bookings</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-4 text-center">
          <p className="text-2xl font-bold text-amber-600">{list.filter((b) => b.status === "pending").length}</p>
          <p className="text-sm text-gray-500">Pending</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-4 text-center">
          <p className="text-2xl font-bold text-green-600">{list.filter((b) => b.status === "confirmed").length}</p>
          <p className="text-sm text-gray-500">Confirmed</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-4 text-center">
          <p className="text-2xl font-bold text-gray-600">{pastBookings.length}</p>
          <p className="text-sm text-gray-500">Past</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6 md:p-8">
        <h2 className="text-xl font-bold mb-4">Recent Bookings</h2>
        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
          </div>
        ) : list.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">No bookings yet</p>
            <Link to="/homestays" className="bg-emerald-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-emerald-700 transition-colors">
              Browse Homestays
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {list.slice(0, 5).map((b) => (
              <div key={b.id} className="border border-gray-200 rounded-lg p-4 flex justify-between items-center">
                <div>
                  <p className="font-semibold">{b.homestay_name}</p>
                  <p className="text-sm text-gray-500">{new Date(b.check_in).toLocaleDateString()} - {new Date(b.check_out).toLocaleDateString()}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  b.status === "confirmed" ? "bg-green-100 text-green-700" :
                  b.status === "pending" ? "bg-yellow-100 text-yellow-700" :
                  b.status === "cancelled" ? "bg-red-100 text-red-700" :
                  "bg-gray-100 text-gray-700"
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
