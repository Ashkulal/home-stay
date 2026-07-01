import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { bookings, homestays } from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function Bookings() {
  const [list, setList] = useState([]);
  const [homestayList, setHomestayList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const preselectedHomestay = searchParams.get("homestay") || "";
  const { user } = useAuth();

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
      if (err.response?.status === 401) {
        setList([]);
      }
    }
    setLoading(false);
  };

  useEffect(() => { loadData(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await bookings.create(form);
      setForm({ homestay_id: "", check_in: "", check_out: "", guests: 1 });
      loadData();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create booking");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Cancel this booking?")) return;
    await bookings.delete(id);
    loadData();
  };

  if (loading) return <div className="text-center py-16">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-2xl md:text-4xl font-bold text-center mb-8">Bookings</h1>

      {user && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8 max-w-xl mx-auto">
          <h2 className="text-xl font-semibold mb-4">Create Booking</h2>
          <form onSubmit={handleCreate} className="space-y-4">
            <select value={form.homestay_id} onChange={(e) => setForm({ ...form, homestay_id: e.target.value })} className="w-full border rounded-lg px-3 py-2" required>
              <option value="">Select Homestay</option>
              {homestayList.map((h) => (
                <option key={h.id} value={h.id}>{h.name} - ₹{h.price_per_night}/night</option>
              ))}
            </select>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-1">Check In</label>
                <input type="date" value={form.check_in} onChange={(e) => setForm({ ...form, check_in: e.target.value })} className="w-full border rounded-lg px-3 py-2" required />
              </div>
              <div>
                <label className="block text-sm mb-1">Check Out</label>
                <input type="date" value={form.check_out} onChange={(e) => setForm({ ...form, check_out: e.target.value })} className="w-full border rounded-lg px-3 py-2" required />
              </div>
            </div>
            <input type="number" min="1" value={form.guests} onChange={(e) => setForm({ ...form, guests: e.target.value })} className="w-full border rounded-lg px-3 py-2" placeholder="Guests" required />
            <button type="submit" className="w-full bg-emerald-600 text-white py-2 rounded-lg hover:bg-emerald-700">Book Now</button>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Your Bookings</h2>
        {list.length === 0 ? (
          <p className="text-gray-500">No bookings yet</p>
        ) : (
          <div className="space-y-4">
            {list.map((b) => (
              <div key={b.id} className="border rounded-lg p-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                <div>
                  <p className="font-semibold">{b.homestay_name}</p>
                  <p className="text-sm text-gray-500">{new Date(b.check_in).toLocaleDateString()} - {new Date(b.check_out).toLocaleDateString()}</p>
                  <p className="text-sm text-gray-500">{b.guests} guest(s) - {b.status}</p>
                </div>
                <div className="flex gap-3 items-center">
                  {b.status === "pending" && (
                    <Link to={`/payment?booking=${b.id}&amount=${b.amount || 0}`} className="bg-emerald-600 text-white px-3 py-1 rounded text-sm hover:bg-emerald-700">Pay</Link>
                  )}
                  <button onClick={() => handleDelete(b.id)} className="text-red-500 hover:text-red-700">Cancel</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
