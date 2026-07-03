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
      toast.error(err.response?.data?.message || "Failed");
    }
  };

  const pending = list.filter((b) => b.status === "pending");
  const confirmed = list.filter((b) => b.status === "confirmed");

  if (loading) return (
    <div className="text-center py-20">
      <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 md:py-12">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">Bookings</h1>

      <div className="space-y-3">
        {list.map((b) => (
          <div key={b.id} className={`bg-white rounded-xl shadow-sm p-4 border-l-4 ${
            b.status === "confirmed" ? "border-green-400" :
            b.status === "pending" ? "border-amber-400" :
            "border-gray-300"
          }`}>
            <div className="flex items-center justify-between gap-3">
              {/* Left: User + Payment */}
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <span className="w-10 h-10 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center font-bold text-sm shrink-0">
                  {b.user_name?.charAt(0).toUpperCase()}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-bold truncate">{b.user_name}</p>
                  <p className="text-xs text-gray-400 truncate">{b.user_email}</p>
                </div>
              </div>

              {/* Right: Payment + Status */}
              <div className="flex items-center gap-3 shrink-0">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  b.payment_status === "verified" ? "bg-green-100 text-green-700" :
                  b.payment_status === "pending" ? "bg-amber-100 text-amber-700" :
                  "bg-gray-100 text-gray-500"
                }`}>
                  {b.payment_status === "verified" ? "Paid" : b.payment_status === "pending" ? "Payment Pending" : "No Payment"}
                </span>

                {b.status === "pending" && (
                  <div className="flex gap-2">
                    <button onClick={() => updateStatus(b.id, "confirmed")}
                      className="bg-green-600 text-white px-3 py-1.5 rounded-lg text-sm font-semibold hover:bg-green-700">
                      Approve
                    </button>
                    <button onClick={() => setActionModal({ id: b.id })}
                      className="bg-red-100 text-red-600 px-3 py-1.5 rounded-lg text-sm font-semibold hover:bg-red-200">
                      Reject
                    </button>
                  </div>
                )}

                {b.status === "confirmed" && (
                  <span className="text-green-600 font-semibold text-sm">✓ Approved</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {list.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl shadow-md">
          <p className="text-gray-400">No bookings yet</p>
        </div>
      )}

      <ConfirmModal
        isOpen={!!actionModal}
        onClose={() => setActionModal(null)}
        onConfirm={() => updateStatus(actionModal?.id, "cancelled")}
        title="Reject Booking"
        message="Are you sure you want to reject this booking?"
        confirmText="Yes, Reject"
        danger
      />
    </div>
  );
}
