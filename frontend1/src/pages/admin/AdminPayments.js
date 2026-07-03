import { useState, useEffect } from "react";
import { payments } from "../../services/api";
import { useToast } from "../../components/Toast";
import ConfirmModal from "../../components/ConfirmModal";

export default function AdminPayments() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();
  const [actionModal, setActionModal] = useState(null);

  const loadData = () => {
    payments.getAll().then(({ data }) => {
      setList(data.payments);
    }).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { loadData(); }, []);

  const handleConfirm = async (id, status) => {
    try {
      await payments.confirm(id, status);
      toast.success(`Payment ${status}`);
      setActionModal(null);
      loadData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update");
    }
  };

  const pending = list.filter((p) => p.status === "pending");
  const confirmed = list.filter((p) => p.status === "confirmed");
  const totalRevenue = confirmed.reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0);

  if (loading) return (
    <div className="text-center py-20">
      <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
      <h1 className="text-3xl font-bold mb-2">Manage Payments</h1>
      <p className="text-gray-500 mb-8">Review and confirm UPI payments</p>

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
        <div className="bg-emerald-50 rounded-xl p-4 text-center border border-emerald-100">
          <p className="text-2xl font-bold text-emerald-600">₹{totalRevenue}</p>
          <p className="text-sm text-gray-500">Revenue</p>
        </div>
      </div>

      {/* Pending */}
      {pending.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-bold text-amber-700 mb-4">⏳ Pending Payments ({pending.length})</h2>
          <div className="space-y-3">
            {pending.map((p) => (
              <div key={p.id} className="bg-white rounded-xl shadow-md p-5 border-l-4 border-amber-400">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex-1">
                    <p className="font-bold">{p.user_name} <span className="text-gray-400 font-normal text-sm">({p.user_email})</span></p>
                    <p className="text-gray-600">{p.homestay_name}</p>
                    <div className="flex flex-wrap gap-3 mt-1 text-sm">
                      <span className="font-bold text-emerald-600">₹{p.amount}</span>
                      {p.transaction_id && <span className="font-mono text-gray-500">Txn: {p.transaction_id}</span>}
                    </div>
                    {p.proof_url && (
                      <a href={p.proof_url} target="_blank" rel="noreferrer" className="text-emerald-600 hover:underline text-sm">
                        📎 View Proof
                      </a>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleConfirm(p.id, "confirmed")}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-700 transition-colors">
                      ✓ Confirm
                    </button>
                    <button onClick={() => setActionModal({ id: p.id, action: "rejected" })}
                      className="bg-red-100 text-red-600 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-200 transition-colors">
                      ✕ Reject
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
        <div>
          <h2 className="text-lg font-bold text-green-700 mb-4">✓ Confirmed ({confirmed.length})</h2>
          <div className="space-y-3">
            {confirmed.map((p) => (
              <div key={p.id} className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-green-400">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold">{p.user_name} — {p.homestay_name}</p>
                    <p className="text-sm text-gray-400">₹{p.amount} · {p.transaction_id || "N/A"}</p>
                  </div>
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">✓ Confirmed</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {list.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl shadow-md">
          <p className="text-gray-400 text-lg">No payments yet</p>
        </div>
      )}

      <ConfirmModal
        isOpen={!!actionModal}
        onClose={() => setActionModal(null)}
        onConfirm={() => handleConfirm(actionModal?.id, actionModal?.action)}
        title="Reject Payment"
        message="Are you sure you want to reject this payment?"
        confirmText="Yes, Reject"
        danger
      />
    </div>
  );
}
