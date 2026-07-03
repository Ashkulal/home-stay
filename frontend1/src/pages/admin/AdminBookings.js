import { useState, useEffect } from "react";
import { admin } from "../../services/api";
import { useToast } from "../../components/Toast";
import ConfirmModal from "../../components/ConfirmModal";

const WHATSAPP = "918660874196";

export default function AdminBookings() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();
  const [actionModal, setActionModal] = useState(null);

  const loadData = () => {
    admin.getBookings().then(({ data }) => {
      setList(data.bookings);
    }).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { loadData(); }, []);

  const updateStatus = async (id, status) => {
    try {
      await admin.updateBookingStatus(id, status);
      toast.success(`Booking ${status}`);
      setActionModal(null);
      loadData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update");
    }
  };

  const pending = list.filter((b) => b.status === "pending");
  const confirmed = list.filter((b) => b.status === "confirmed");
  const others = list.filter((b) => b.status !== "pending" && b.status !== "confirmed");

  const BookingCard = ({ b, showActions }) => {
    const nights = Math.max(1, Math.ceil((new Date(b.check_out) - new Date(b.check_in)) / (1000 * 60 * 60 * 24)));
    const whatsappMsg = encodeURIComponent(
      `Hi ${b.user_name}, regarding your booking at Ibbani Homestay (${b.homestay_name}) from ${new Date(b.check_in).toLocaleDateString()} to ${new Date(b.check_out).toLocaleDateString()} for ${b.guests} guest(s). How can I help?`
    );

    return (
      <div className={`bg-white rounded-xl shadow-sm p-4 border-l-4 ${
        b.status === "confirmed" ? "border-green-400" :
        b.status === "pending" ? "border-amber-400" :
        "border-gray-300"
      }`}>
        {/* User Info */}
        <div className="flex items-center gap-3 mb-3">
          <span className="w-10 h-10 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center font-bold text-sm shrink-0">
            {b.user_name?.charAt(0).toUpperCase()}
          </span>
          <div className="min-w-0 flex-1">
            <p className="font-bold truncate">{b.user_name}</p>
            <p className="text-xs text-gray-400 truncate">{b.user_email}</p>
          </div>
          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold shrink-0 ${
            b.status === "confirmed" ? "bg-green-100 text-green-700" :
            b.status === "pending" ? "bg-amber-100 text-amber-700" :
            b.status === "cancelled" ? "bg-red-100 text-red-600" :
            "bg-gray-100 text-gray-600"
          }`}>
            {b.status}
          </span>
        </div>

        {/* Booking Details */}
        <div className="bg-gray-50 rounded-lg p-3 mb-3 text-sm space-y-1">
          <div className="flex justify-between">
            <span className="text-gray-500">Homestay</span>
            <span className="font-semibold">{b.homestay_name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Check-in</span>
            <span>{new Date(b.check_in).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Check-out</span>
            <span>{new Date(b.check_out).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Duration</span>
            <span>{nights} night{nights > 1 ? "s" : ""}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Guests</span>
            <span>{b.guests} person{b.guests > 1 ? "s" : ""}</span>
          </div>
          <div className="flex justify-between border-t border-gray-200 pt-1 mt-1">
            <span className="text-gray-500 font-semibold">Total</span>
            <span className="font-bold text-emerald-600 text-lg">₹{b.total_amount || "—"}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 flex-wrap">
          {showActions && b.status === "pending" && (
            <>
              <button onClick={() => updateStatus(b.id, "confirmed")}
                className="flex-1 bg-green-600 text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-green-700 transition-colors">
                ✓ Confirm
              </button>
              <button onClick={() => setActionModal({ id: b.id, action: "cancelled" })}
                className="flex-1 bg-red-100 text-red-600 px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-red-200 transition-colors">
                ✕ Reject
              </button>
            </>
          )}
          <a href={`https://wa.me/${WHATSAPP}?text=${whatsappMsg}`}
            target="_blank" rel="noopener noreferrer"
            className="flex-1 bg-green-50 text-green-700 px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-green-100 transition-colors text-center border border-green-200">
            💬 WhatsApp
          </a>
        </div>
      </div>
    );
  };

  if (loading) return (
    <div className="text-center py-20">
      <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 md:py-12">
      <h1 className="text-2xl md:text-3xl font-bold mb-2">Manage Bookings</h1>
      <p className="text-gray-500 mb-6">{list.length} total bookings</p>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-amber-50 rounded-xl p-3 text-center border border-amber-100">
          <p className="text-xl font-bold text-amber-600">{pending.length}</p>
          <p className="text-xs text-gray-500">Pending</p>
        </div>
        <div className="bg-green-50 rounded-xl p-3 text-center border border-green-100">
          <p className="text-xl font-bold text-green-600">{confirmed.length}</p>
          <p className="text-xs text-gray-500">Confirmed</p>
        </div>
        <div className="bg-gray-50 rounded-xl p-3 text-center border border-gray-100">
          <p className="text-xl font-bold text-gray-600">{others.length}</p>
          <p className="text-xs text-gray-500">Other</p>
        </div>
      </div>

      {/* Pending */}
      {pending.length > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-bold text-amber-700 mb-3 uppercase tracking-wide">⏳ Needs Action ({pending.length})</h2>
          <div className="space-y-3">
            {pending.map((b) => <BookingCard key={b.id} b={b} showActions />)}
          </div>
        </div>
      )}

      {/* Confirmed */}
      {confirmed.length > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-bold text-green-700 mb-3 uppercase tracking-wide">✓ Confirmed ({confirmed.length})</h2>
          <div className="space-y-3">
            {confirmed.map((b) => <BookingCard key={b.id} b={b} />)}
          </div>
        </div>
      )}

      {/* Others */}
      {others.length > 0 && (
        <div>
          <h2 className="text-sm font-bold text-gray-500 mb-3 uppercase tracking-wide">Other</h2>
          <div className="space-y-3">
            {others.map((b) => <BookingCard key={b.id} b={b} />)}
          </div>
        </div>
      )}

      {list.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl shadow-md">
          <p className="text-gray-400 text-lg">No bookings yet</p>
        </div>
      )}

      <ConfirmModal
        isOpen={!!actionModal}
        onClose={() => setActionModal(null)}
        onConfirm={() => updateStatus(actionModal?.id, actionModal?.action)}
        title="Cancel Booking"
        message="Are you sure you want to cancel this booking?"
        confirmText="Yes, Cancel"
        danger
      />
    </div>
  );
}
