import { useState, useEffect } from "react";
import { admin } from "../../services/api";

export default function AdminBookings() {
  const [bookingsList, setBookingsList] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadBookings = () => {
    admin.getBookings().then(({ data }) => {
      setBookingsList(data.bookings);
    }).catch(() => {}).finally(() => {
      setLoading(false);
    });
  };

  useEffect(() => { loadBookings(); }, []);

  const updateStatus = async (id, status) => {
    try {
      await admin.updateBookingStatus(id, status);
      loadBookings();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update booking");
    }
  };

  if (loading) return <div className="text-center py-16">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Manage Bookings</h1>
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">User</th>
                <th className="text-left py-2">Homestay</th>
                <th className="text-left py-2">Check In</th>
                <th className="text-left py-2">Check Out</th>
                <th className="text-left py-2">Guests</th>
                <th className="text-left py-2">Status</th>
                <th className="text-left py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookingsList.map((b) => (
                <tr key={b.id} className="border-b">
                  <td className="py-2">{b.user_name}</td>
                  <td className="py-2">{b.homestay_name}</td>
                  <td className="py-2">{new Date(b.check_in).toLocaleDateString()}</td>
                  <td className="py-2">{new Date(b.check_out).toLocaleDateString()}</td>
                  <td className="py-2">{b.guests}</td>
                  <td className="py-2">
                    <span className={`px-2 py-1 rounded text-sm ${b.status === "confirmed" ? "bg-green-100 text-green-700" : b.status === "pending" ? "bg-yellow-100 text-yellow-700" : "bg-gray-100 text-gray-700"}`}>
                      {b.status}
                    </span>
                  </td>
                  <td className="py-2 space-x-2">
                    <button onClick={() => updateStatus(b.id, "confirmed")} className="text-green-600 hover:underline text-sm">Confirm</button>
                    <button onClick={() => updateStatus(b.id, "cancelled")} className="text-red-500 hover:underline text-sm">Cancel</button>
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
