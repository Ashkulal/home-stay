import { useState, useEffect } from "react";
import { payments } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useSearchParams, Link } from "react-router-dom";
import { useToast } from "../components/Toast";

export default function Payment() {
  const [paymentInfo, setPaymentInfo] = useState(null);
  const [myPayments, setMyPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const bookingId = searchParams.get("booking") || "";
  const amount = searchParams.get("amount") || "";
  const { user } = useAuth();
  const toast = useToast();

  const [form, setForm] = useState({ booking_id: bookingId, amount: amount, transaction_id: "", proof_url: "" });

  useEffect(() => {
    setForm(prev => ({ ...prev, booking_id: bookingId, amount: amount }));
  }, [bookingId, amount]);

  const loadData = () => {
    Promise.all([payments.getInfo(), user ? payments.getMy() : Promise.resolve({ data: { payments: [] } })]).then(([info, my]) => {
      setPaymentInfo(info.data);
      setMyPayments(my.data.payments);
      setLoading(false);
    }).catch(() => setLoading(false));
  };

  useEffect(() => { loadData(); }, [user]);

  const handleInitiate = async (e) => {
    e.preventDefault();
    try {
      await payments.initiate({
        booking_id: form.booking_id,
        amount: form.amount,
        transaction_id: form.transaction_id || undefined,
        proof_url: form.proof_url || undefined
      });
      setForm({ booking_id: "", amount: "", transaction_id: "", proof_url: "" });
      toast.success("Payment submitted! Waiting for confirmation.");
      const { data } = await payments.getMy();
      setMyPayments(data.payments);
    } catch (err) {
      toast.error(err.response?.data?.message || "Payment failed");
    }
  };

  if (loading) return <div className="text-center py-16"><div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600"></div></div>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Payment</h1>

      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Pay via UPI</h2>
        <p className="text-gray-600 mb-6">Scan the QR code or use the UPI ID below to make payment. Then enter your transaction ID.</p>

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <div className="mb-4">
              <p className="text-sm text-gray-500">UPI ID:</p>
              <p className="text-lg font-mono font-bold text-emerald-600">{paymentInfo?.upiId || "paytmqr70c5mh@ptys"}</p>
            </div>
            <div className="mb-4">
              <p className="text-sm text-gray-500">Name: AKASH H R</p>
            </div>
            <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 inline-block bg-gray-50">
              <img src="/upi-qr.jpeg" alt="UPI QR Code" className="w-56 h-56 object-contain" />
            </div>
          </div>

          <div>
            {user ? (
              <form onSubmit={handleInitiate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Booking ID</label>
                  <input type="text" value={form.booking_id} onChange={(e) => setForm({ ...form, booking_id: e.target.value })} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="Enter booking ID" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₹)</label>
                  <input type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500 outline-none" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">UPI Transaction ID</label>
                  <input type="text" value={form.transaction_id} onChange={(e) => setForm({ ...form, transaction_id: e.target.value })} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="e.g. 123456789012" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Screenshot URL (optional)</label>
                  <input type="url" value={form.proof_url} onChange={(e) => setForm({ ...form, proof_url: e.target.value })} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="https://..." />
                </div>
                <button type="submit" className="w-full bg-emerald-600 text-white py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors">
                  Submit Payment
                </button>
              </form>
            ) : (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <p className="text-gray-500 mb-4">Login to submit payment proof</p>
                <Link to="/login" className="bg-emerald-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-emerald-700 transition-colors">
                  Login
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {user && myPayments.length > 0 && (
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Payment History</h2>
          <div className="space-y-3">
            {myPayments.map((p) => (
              <div key={p.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold">{p.homestay_name}</p>
                    <p className="text-sm text-gray-500">₹{p.amount} | Txn: {p.transaction_id || "N/A"}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    p.status === "confirmed" ? "bg-green-100 text-green-700" :
                    p.status === "rejected" ? "bg-red-100 text-red-700" :
                    "bg-yellow-100 text-yellow-700"
                  }`}>
                    {p.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
