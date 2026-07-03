import { useState, useEffect } from "react";
import { admin } from "../../services/api";
import { useToast } from "../../components/Toast";
import ConfirmModal from "../../components/ConfirmModal";

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

  if (loading) return (
    <div className="text-center py-20">
      <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
      <h1 className="text-3xl font-bold mb-2">Manage Bookings</h1>
      <p className="text-gray-500 mb-8">{list.length} total bookings</p>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-amber-50 rounded-xl p-4 text-center border border-amber-100">
          <p className="text-2xl font-bold text-amber-600">{pending.length}</p>
          <p className="text-sm text-gray-500">Pending</p>
        </div>
        <div className="bg-green-50 rounded-xl p-4 text-center border border-green-100">
          <p className="text-2xl font-bold text-green-600">{confirmed.length}</p>
          <p className="text-sm text-gray-500">Confirmed</p>
        </div>
        <div className="bg-gray-50 rounded-xl p-4 text-center border border-gray-100">
          <p className="text-2xl font-bold text-gray-600">{others.length}</p>
          <p className="text-sm text-gray-500">Other</p>
        </div>
      </div>

      {/* Pending */}
      {pending.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-bold text-amber-700 mb-4">⏳ Pending ({pending.length})</h2>
          <div className="space-y-3">
            {pending.map((b) => (
              <div key={b.id} className="bg-white rounded-xl shadow-md p-5 border-l-4 border-amber-400">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex-1">
                    <p className="font-bold">{b.user_name} <span className="text-gray-400 font-normal text-sm">({b.user_email})</span></p>
                    <p className="text-gray-600">{b.homestay_name} · {b.guests} guests</p>
                    <p className="text-sm text-gray-400">
                      {new Date(b.check_in).toLocaleDateString()} — {new Date(b.check_out).toLocaleDateString()}
                      {b.total_amount && <span className="ml-2 text-emerald-600 font-bold">₹{b.total_amount}</span>}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => updateStatus(b.id, "confirmed")}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-700 transition-colors">
                      ✓ Confirm
                    </button>
                    <button onClick={() => setActionModal({ id: b.id, action: "cancelled" })}
                      className="bg-red-100 text-red-600 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-200 transition-colors">
                      ✕ Cancel
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Confirmed */}
      {confirmed.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-bold text-green-700 mb-4">✓ Confirmed ({confirmed.length})</h2>
          <div className="space-y-3">
            {confirmed.map((b) => (
              <div key={b.id} className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-green-400">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold">{b.user_name}</p>
                    <p className="text-sm text-gray-500">{b.homestay_name} · {b.guests} guests</p>
                  </div>
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">Confirmed</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Others */}
      {others.length > 0 && (
        <div>
          <h2 className="text-lg font-bold text-gray-500 mb-4">Other</h2>
          <div className="space-y-3">
            {others.map((b) => (
              <div key={b.id} className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold">{b.user_name}</p>
                    <p className="text-sm text-gray-400">{b.homestay_name} · {new Date(b.check_in).toLocaleDateString()}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    b.status === "cancelled" ? "bg-red-100 text-red-600" : "bg-gray-200 text-gray-600"
                  }`}>{b.status}</span>
                </div>
              </div>
            ))}
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
