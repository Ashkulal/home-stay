import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { bookings, homestays } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../components/Toast";
import ConfirmModal from "../components/ConfirmModal";

export default function Bookings() {
  const [list, setList] = useState([]);
  const [homestayList, setHomestayList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const preselectedHomestay = searchParams.get("homestay") || "";
  const { user } = useAuth();
  const toast = useToast();
  const [deleteId, setDeleteId] = useState(null);

  const [form, setForm] = useState({
    homestay_id: preselectedHomestay,
    check_in: "",
    check_out: "",
    guests: 1,
  });

  const loadData = async () => {
    try {
      const [bRes, hRes] = await Promise.all([bookings.getAll(), homestays.getAll()]);
      setList(bRes.data.bookings);
      setHomestayList(hRes.data.homestays);
    } catch (err) {
      if (err.response?.status === 401) setList([]);
    }
    setLoading(false);
  };

  useEffect(() => { loadData(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await bookings.create(form);
      setForm({ homestay_id: "", check_in: "", check_out: "", guests: 1 });
      toast.success("Booking created successfully!");
      loadData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create booking");
    }
  };

  const handleDelete = async () => {
    try {
      await bookings.delete(deleteId);
      toast.success("Booking cancelled");
      loadData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to cancel booking");
    }
  };

  if (loading) return <div className="text-center py-16"><div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600"></div></div>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">My Bookings</h1>

      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">New Booking</h2>
        <form onSubmit={handleCreate} className="space-y-4">
          <select value={form.homestay_id} onChange={(e) => setForm({ ...form, homestay_id: e.target.value })} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500 outline-none" required>
            <option value="">Select Homestay</option>
            {homestayList.map((h) => (
              <option key={h.id} value={h.id}>{h.name} - ₹{h.price_per_night}/night</option>
            ))}
          </select>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Check In</label>
              <input type="date" value={form.check_in} onChange={(e) => setForm({ ...form, check_in: e.target.value })} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500 outline-none" min={new Date().toISOString().split("T")[0]} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Check Out</label>
              <input type="date" value={form.check_out} onChange={(e) => setForm({ ...form, check_out: e.target.value })} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500 outline-none" min={form.check_in || new Date().toISOString().split("T")[0]} required />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Guests</label>
            <input type="number" min="1" max="50" value={form.guests} onChange={(e) => setForm({ ...form, guests: e.target.value })} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500 outline-none" required />
          </div>
          <button type="submit" className="w-full bg-emerald-600 text-white py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors">
            Create Booking
          </button>
        </form>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Booking History</h2>
        {list.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No bookings yet</p>
        ) : (
          <div className="space-y-3">
            {list.map((b) => (
              <div key={b.id} className="border border-gray-200 rounded-lg p-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                <div>
                  <p className="font-semibold">{b.homestay_name}</p>
                  <p className="text-sm text-gray-500">{new Date(b.check_in).toLocaleDateString()} - {new Date(b.check_out).toLocaleDateString()}</p>
                  <p className="text-sm text-gray-500">{b.guests} guest(s)</p>
                </div>
                <div className="flex gap-3 items-center">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    b.status === "confirmed" ? "bg-green-100 text-green-700" :
                    b.status === "pending" ? "bg-yellow-100 text-yellow-700" :
                    b.status === "cancelled" ? "bg-red-100 text-red-700" :
                    "bg-gray-100 text-gray-700"
                  }`}>
                    {b.status}
                  </span>
                  {b.status === "pending" && (
                    <Link to={`/payment?booking=${b.id}&amount=${b.amount || 0}`} className="bg-emerald-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors">
                      Pay Now
                    </Link>
                  )}
                  {b.status !== "cancelled" && b.status !== "completed" && (
                    <button onClick={() => setDeleteId(b.id)} className="text-red-500 hover:text-red-700 text-sm font-medium">
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Cancel Booking"
        message="Are you sure you want to cancel this booking? This action cannot be undone."
        confirmText="Cancel Booking"
        danger
      />
    </div>
  );
}
