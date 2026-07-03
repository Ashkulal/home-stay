import { useState, useEffect } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { bookings, homestays } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../components/Toast";
import ConfirmModal from "../components/ConfirmModal";

const WHATSAPP = "918660874196";

export default function Bookings() {
  const [list, setList] = useState([]);
  const [homestayList, setHomestayList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const preselected = searchParams.get("homestay") || "";
  const { user } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [deleteId, setDeleteId] = useState(null);
  const [showForm, setShowForm] = useState(!!preselected);

  const [selectedHomestay, setSelectedHomestay] = useState(null);
  const [form, setForm] = useState({
    homestay_id: preselected || "",
    check_in: "",
    check_out: "",
    guests: 2,
  });

  const PRICE_PER_PERSON = 1500;
  const nights = form.check_in && form.check_out
    ? Math.max(1, Math.ceil((new Date(form.check_out) - new Date(form.check_in)) / (1000 * 60 * 60 * 24)))
    : 0;
  const guestsInt = parseInt(form.guests) || 0;
  const totalAmount = guestsInt * nights * PRICE_PER_PERSON;

  const loadData = async () => {
    try {
      const [bRes, hRes] = await Promise.all([bookings.getAll(), homestays.getAll()]);
      setList(bRes.data.bookings);
      setHomestayList(hRes.data.homestays);
      const hList = hRes.data.homestays;
      if (hList.length === 1 && !form.homestay_id) {
        setSelectedHomestay(hList[0]);
        setForm((prev) => ({ ...prev, homestay_id: hList[0].id }));
      } else if (preselected) {
        const h = hList.find((x) => String(x.id) === String(preselected));
        if (h) setSelectedHomestay(h);
      }
    } catch (err) {
      if (err.response?.status === 401) setList([]);
    }
    setLoading(false);
  };

  useEffect(() => { loadData(); }, [preselected]);

  const handleHomestaySelect = (id) => {
    const h = homestayList.find((x) => String(x.id) === String(id));
    setSelectedHomestay(h || null);
    setForm({ ...form, homestay_id: id });
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const { data } = await bookings.create(form);
      toast.success("Booking created! Now complete payment.");
      setForm({ homestay_id: "", check_in: "", check_out: "", guests: 2 });
      setShowForm(false);
      loadData();
      navigate(`/payment?booking=${data.booking.id}&amount=${data.booking.total_amount}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create booking");
    }
  };

  const handleCancel = async () => {
    try {
      await bookings.cancel(deleteId);
      toast.success("Booking cancelled");
      loadData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to cancel");
    }
  };

  if (loading) return (
    <div className="text-center py-20">
      <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
    </div>
  );

  const pending = list.filter((b) => b.status === "pending");
  const confirmed = list.filter((b) => b.status === "confirmed");
  const past = list.filter((b) => b.status === "cancelled" || b.status === "completed");

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 md:py-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">My Bookings</h1>
          <p className="text-gray-500 mt-1">Manage your stays at Ibbani Homestay</p>
        </div>
        {!showForm && (
          <button onClick={() => setShowForm(true)} className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-emerald-700 transition-all shadow-md hover:shadow-lg">
            + New Booking
          </button>
        )}
      </div>

      {/* New Booking Form */}
      {showForm && (
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-8 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Book Your Stay</h2>
            {list.length > 0 && (
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600 text-2xl">✕</button>
            )}
          </div>

          <form onSubmit={handleCreate} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Select Homestay</label>
              <div className="grid sm:grid-cols-2 gap-3">
                {homestayList.map((h) => (
                  <button
                    type="button"
                    key={h.id}
                    onClick={() => handleHomestaySelect(h.id)}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      String(form.homestay_id) === String(h.id)
                        ? "border-emerald-500 bg-emerald-50 shadow-md"
                        : "border-gray-200 hover:border-emerald-300"
                    }`}
                  >
                    <p className="font-semibold">{h.name}</p>
                    <p className="text-emerald-600 font-bold">₹{h.price_per_night}/night</p>
                    {h.max_guests && <p className="text-gray-400 text-sm">Up to {h.max_guests} guests</p>}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Check-in</label>
                <input type="date" value={form.check_in}
                  onChange={(e) => setForm({ ...form, check_in: e.target.value })}
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 outline-none"
                  required />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Check-out</label>
                <input type="date" value={form.check_out}
                  onChange={(e) => setForm({ ...form, check_out: e.target.value })}
                  min={form.check_in || new Date().toISOString().split("T")[0]}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 outline-none"
                  required />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Guests</label>
                <input type="number" min="1" max={selectedHomestay?.max_guests || 50}
                  value={form.guests}
                  onChange={(e) => setForm({ ...form, guests: e.target.value })}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 outline-none"
                  required />
              </div>
            </div>

            {/* Price Breakdown */}
            {nights > 0 && guestsInt > 0 && (
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-5 border border-emerald-100">
                <h3 className="font-semibold text-gray-700 mb-3">Price Breakdown</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Price per person per night</span>
                    <span>₹{PRICE_PER_PERSON}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Number of nights</span>
                    <span>{nights}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Number of guests</span>
                    <span>{guestsInt}</span>
                  </div>
                  <div className="border-t border-emerald-200 pt-2 mt-2">
                    <div className="flex justify-between font-bold text-lg text-emerald-700">
                      <span>Total</span>
                      <span>₹{totalAmount}</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">{guestsInt} guests × {nights} nights × ₹{PRICE_PER_PERSON}</p>
                  </div>
                </div>
              </div>
            )}

            <button type="submit"
              disabled={!form.homestay_id || !form.check_in || !form.check_out || nights <= 0}
              className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-emerald-700 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-md hover:shadow-lg">
              Confirm Booking — ₹{totalAmount || 0}
            </button>
          </form>
        </div>
      )}

      {/* Pending Bookings */}
      {pending.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-bold text-amber-700 mb-4 flex items-center gap-2">
            <span className="w-3 h-3 bg-amber-400 rounded-full animate-pulse"></span>
            Pending Payment ({pending.length})
          </h2>
          <div className="space-y-4">
            {pending.map((b) => (
              <div key={b.id} className="bg-white rounded-2xl shadow-md p-5 border-l-4 border-amber-400">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex-1">
                    <p className="font-bold text-lg">{b.homestay_name}</p>
                    <div className="flex flex-wrap gap-3 mt-2 text-sm text-gray-500">
                      <span>📅 {new Date(b.check_in).toLocaleDateString("en-IN", { day: "numeric", month: "short" })} — {new Date(b.check_out).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</span>
                      <span>👥 {b.guests} guest(s)</span>
                      {b.total_amount && <span className="font-bold text-emerald-600">₹{b.total_amount}</span>}
                    </div>
                  </div>
                  <div className="flex gap-3 shrink-0">
                    <Link to={`/payment?booking=${b.id}&amount=${b.total_amount || 0}`}
                      className="bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-emerald-700 transition-all shadow-md text-sm">
                      💳 Pay Now
                    </Link>
                    <button onClick={() => setDeleteId(b.id)}
                      className="text-red-500 hover:text-red-700 font-medium text-sm px-3 py-2 rounded-xl hover:bg-red-50 transition-colors">
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Confirmed Bookings */}
      {confirmed.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-bold text-green-700 mb-4 flex items-center gap-2">
            <span className="w-3 h-3 bg-green-400 rounded-full"></span>
            Confirmed ({confirmed.length})
          </h2>
          <div className="space-y-4">
            {confirmed.map((b) => (
              <div key={b.id} className="bg-white rounded-2xl shadow-md p-5 border-l-4 border-green-400">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex-1">
                    <p className="font-bold text-lg">{b.homestay_name}</p>
                    <div className="flex flex-wrap gap-3 mt-2 text-sm text-gray-500">
                      <span>📅 {new Date(b.check_in).toLocaleDateString("en-IN", { day: "numeric", month: "short" })} — {new Date(b.check_out).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</span>
                      <span>👥 {b.guests} guest(s)</span>
                      {b.total_amount && <span className="font-bold text-emerald-600">₹{b.total_amount}</span>}
                    </div>
                  </div>
                  <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold">✓ Confirmed</span>
                </div>
                <a href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(`Hi, I have a confirmed booking at Ibbani Homestay (${b.homestay_name}) from ${b.check_in} to ${b.check_out}. Need any help?`)}`}
                  target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 mt-3 text-green-600 hover:text-green-700 font-medium text-sm">
                  💬 Chat on WhatsApp for check-in details
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Past Bookings */}
      {past.length > 0 && (
        <div>
          <h2 className="text-lg font-bold text-gray-500 mb-4">Past</h2>
          <div className="space-y-3">
            {past.map((b) => (
              <div key={b.id} className="bg-gray-50 rounded-xl p-4 opacity-70">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold">{b.homestay_name}</p>
                    <p className="text-sm text-gray-400">{new Date(b.check_in).toLocaleDateString()} — {new Date(b.check_out).toLocaleDateString()}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    b.status === "cancelled" ? "bg-red-100 text-red-600" : "bg-gray-200 text-gray-600"
                  }`}>
                    {b.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {list.length === 0 && !showForm && (
        <div className="text-center py-16 bg-white rounded-2xl shadow-md">
          <div className="text-6xl mb-4">🏡</div>
          <h2 className="text-2xl font-bold mb-2">No bookings yet</h2>
          <p className="text-gray-500 mb-6">Book your first mountain getaway at Ibbani Homestay</p>
          <button onClick={() => setShowForm(true)} className="bg-emerald-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-emerald-700 transition-all shadow-md">
            Book Now
          </button>
        </div>
      )}

      <ConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleCancel}
        title="Cancel Booking"
        message="Are you sure you want to cancel this booking?"
        confirmText="Yes, Cancel"
        danger
      />
    </div>
  );
}
