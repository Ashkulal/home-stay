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

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Dashboard</h1>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-2">Welcome, {user.name}!</h2>
        <p className="text-gray-600">{user.email}</p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Bookings</h2>
        {loading ? (
          <p>Loading...</p>
        ) : list.length === 0 ? (
          <p className="text-gray-500">No bookings yet. <Link to="/homestays" className="text-emerald-600 hover:underline">Browse homestays</Link></p>
        ) : (
          <div className="space-y-3">
            {list.slice(0, 5).map((b) => (
              <div key={b.id} className="border rounded-lg p-3">
                <p className="font-semibold">{b.homestay_name}</p>
                <p className="text-sm text-gray-500">{new Date(b.check_in).toLocaleDateString()} - {new Date(b.check_out).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
