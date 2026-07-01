import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { admin } from "../../services/api";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    admin.getStats().then(({ data }) => {
      setStats(data.stats);
    }).catch(() => {}).finally(() => {
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="text-center py-16">Loading...</div>;
  if (!stats) return <div className="text-center py-16">Failed to load stats</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-2xl md:text-4xl font-bold mb-8">Admin Dashboard</h1>

      <div className="grid grid-cols-2 md:flex gap-4 mb-8">
        <Link to="/admin/users" className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg text-center flex-1">
          <div className="text-2xl mb-1">👥</div>
          <div className="font-semibold">Users</div>
        </Link>
        <Link to="/admin/bookings" className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg text-center flex-1">
          <div className="text-2xl mb-1">📋</div>
          <div className="font-semibold">Bookings</div>
        </Link>
        <Link to="/admin/content" className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg text-center flex-1">
          <div className="text-2xl mb-1">📝</div>
          <div className="font-semibold">Content</div>
        </Link>
        <Link to="/admin/payments" className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg text-center flex-1">
          <div className="text-2xl mb-1">💰</div>
          <div className="font-semibold">Payments</div>
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-gray-500">Users</h3>
          <p className="text-3xl font-bold text-emerald-600">{stats.totalUsers}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-gray-500">Peaks</h3>
          <p className="text-3xl font-bold text-emerald-600">{stats.totalPeaks}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-gray-500">Homestays</h3>
          <p className="text-3xl font-bold text-emerald-600">{stats.totalHomestays}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-gray-500">Revenue</h3>
          <p className="text-3xl font-bold text-emerald-600">₹{stats.totalRevenue}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Bookings</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">User</th>
                <th className="text-left py-2">Homestay</th>
                <th className="text-left py-2">Check In</th>
                <th className="text-left py-2">Check Out</th>
                <th className="text-left py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentBookings.map((b) => (
                <tr key={b.id} className="border-b">
                  <td className="py-2">{b.user_name}</td>
                  <td className="py-2">{b.homestay_name}</td>
                  <td className="py-2">{new Date(b.check_in).toLocaleDateString()}</td>
                  <td className="py-2">{new Date(b.check_out).toLocaleDateString()}</td>
                  <td className="py-2">
                    <span className={`px-2 py-1 rounded text-sm ${b.status === "confirmed" ? "bg-green-100 text-green-700" : b.status === "pending" ? "bg-yellow-100 text-yellow-700" : "bg-gray-100 text-gray-700"}`}>
                      {b.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
