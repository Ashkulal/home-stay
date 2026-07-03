import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { admin } from "../../services/api";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    admin.getStats().then(({ data }) => {
      setStats(data.stats);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="text-center py-20">
      <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
    </div>
  );
  if (!stats) return <div className="text-center py-16 text-gray-500">Failed to load stats</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 md:py-12">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">Admin Dashboard</h1>

      {/* Quick Links */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <Link to="/admin/users"
          className="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition-all border border-gray-100 text-center group">
          <div className="text-2xl mb-1">👥</div>
          <p className="font-bold text-sm group-hover:text-emerald-600 transition-colors">Users</p>
          <p className="text-emerald-600 font-bold text-lg">{stats.totalUsers}</p>
        </Link>
        <Link to="/admin/payments"
          className="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition-all border border-gray-100 text-center group">
          <div className="text-2xl mb-1">💰</div>
          <p className="font-bold text-sm group-hover:text-emerald-600 transition-colors">Payments</p>
          <p className="text-emerald-600 font-bold text-lg">₹{stats.totalRevenue}</p>
        </Link>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
        <h2 className="font-bold mb-4">Recent Activity</h2>
        {stats.recentBookings.length === 0 ? (
          <p className="text-gray-400 text-center py-4">No activity yet</p>
        ) : (
          <div className="space-y-3">
            {stats.recentBookings.map((b) => (
              <div key={b.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-sm truncate">{b.user_name}</p>
                  <p className="text-xs text-gray-400">{b.homestay_name} · {new Date(b.check_in).toLocaleDateString()}</p>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold shrink-0 ml-2 ${
                  b.status === "confirmed" ? "bg-green-100 text-green-700" :
                  b.status === "pending" ? "bg-amber-100 text-amber-700" :
                  "bg-gray-100 text-gray-600"
                }`}>{b.status}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
