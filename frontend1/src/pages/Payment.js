import { useState, useEffect } from "react";
import { payments } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useSearchParams, Link } from "react-router-dom";
import { useToast } from "../components/Toast";

const WHATSAPP = "918660874196";
const UPI_ID = "paytmqr70c5mh@ptys";
const PAYEE_NAME = "AKASH H R";

export default function Payment() {
  const [paymentInfo, setPaymentInfo] = useState(null);
  const [myPayments, setMyPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const bookingId = searchParams.get("booking") || "";
  const amount = searchParams.get("amount") || "";
  const { user } = useAuth();
  const toast = useToast();
  const [txnId, setTxnId] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const loadData = () => {
    Promise.all([
      payments.getInfo(),
      user ? payments.getMy() : Promise.resolve({ data: { payments: [] } })
    ]).then(([info, my]) => {
      setPaymentInfo(info.data);
      setMyPayments(my.data.payments);
    }).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { loadData(); }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await payments.initiate({
        booking_id: bookingId,
        amount: amount,
        transaction_id: txnId || undefined,
      });
      toast.success("Payment submitted! Waiting for admin confirmation.");
      setTxnId("");
      loadData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Payment failed");
    }
    setSubmitting(false);
  };

  const upiUrl = `upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent(PAYEE_NAME)}&am=${amount}&cu=INR`;
  const whatsappMsg = encodeURIComponent(
    `Hi, I've made a UPI payment for Ibbani Homestay booking.\n\nBooking ID: ${bookingId}\nAmount: ₹${amount}\nUPI Transaction ID: ${txnId || "N/A"}\n\nPlease confirm my booking.`
  );

  if (loading) return (
    <div className="text-center py-20">
      <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
      <h1 className="text-3xl font-bold mb-2">Complete Payment</h1>
      <p className="text-gray-500 mb-8">Pay securely via UPI and submit your transaction ID</p>

      {/* Payment Card */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-6">
          <p className="text-emerald-100 text-sm">Amount to Pay</p>
          <p className="text-4xl font-extrabold">₹{amount || "0"}</p>
          <p className="text-emerald-200 text-sm mt-1">Booking #{bookingId}</p>
        </div>

        <div className="p-6 md:p-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Left: QR Code */}
            <div className="text-center">
              <h3 className="font-bold text-lg mb-4">Scan & Pay</h3>
              <div className="inline-block bg-white rounded-2xl p-4 shadow-inner border-2 border-emerald-100 mb-4">
                <img src="/upi-qr.jpeg" alt="UPI QR Code" className="w-56 h-56 object-contain" />
              </div>
              <div className="bg-gray-50 rounded-xl p-4 mt-2">
                <p className="text-sm text-gray-500 mb-1">UPI ID</p>
                <p className="font-mono font-bold text-emerald-600 text-lg">{UPI_ID}</p>
                <p className="text-sm text-gray-400 mt-1">Payee: {PAYEE_NAME}</p>
              </div>
              <a href={upiUrl}
                className="mt-4 inline-flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-emerald-700 transition-colors shadow-md">
                Open UPI App
              </a>
            </div>

            {/* Right: Submit Proof */}
            <div>
              <h3 className="font-bold text-lg mb-4">Submit Payment Proof</h3>

              {!user ? (
                <div className="bg-gray-50 rounded-xl p-8 text-center">
                  <p className="text-gray-500 mb-4">Login to submit payment proof</p>
                  <Link to="/login" className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-emerald-700 transition-colors">
                    Login
                  </Link>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                    <p className="text-sm text-blue-700 font-medium">Steps to pay:</p>
                    <ol className="text-sm text-blue-600 mt-2 space-y-1 list-decimal list-inside">
                      <li>Open any UPI app (PhonePe, GPay, Paytm)</li>
                      <li>Scan the QR code or use UPI ID</li>
                      <li>Pay ₹{amount}</li>
                      <li>Copy the UPI Transaction ID</li>
                      <li>Paste it below and submit</li>
                    </ol>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">UPI Transaction ID *</label>
                    <input type="text" value={txnId} onChange={(e) => setTxnId(e.target.value)}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 outline-none font-mono"
                      placeholder="e.g. 123456789012" required />
                  </div>

                  <button type="submit" disabled={submitting || !txnId}
                    className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-emerald-700 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-md">
                    {submitting ? "Submitting..." : "Submit Payment Proof"}
                  </button>
                </form>
              )}

              {/* WhatsApp */}
              <div className="mt-6 bg-green-50 rounded-xl p-4 border border-green-100">
                <p className="text-sm text-green-700 font-medium mb-2">Need help with payment?</p>
                <a href={`https://wa.me/${WHATSAPP}?text=${whatsappMsg}`}
                  target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-green-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-green-700 transition-colors text-sm">
                  💬 Send Payment Details on WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment History */}
      {user && myPayments.length > 0 && (
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Payment History</h2>
          <div className="space-y-3">
            {myPayments.map((p) => (
              <div key={p.id} className="border border-gray-200 rounded-xl p-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex-1">
                    <p className="font-semibold">{p.homestay_name}</p>
                    <p className="text-sm text-gray-500">₹{p.amount} · Txn: {p.transaction_id || "N/A"}</p>
                  </div>
                  <span className={`px-4 py-1.5 rounded-full text-sm font-semibold ${
                    p.status === "confirmed" ? "bg-green-100 text-green-700" :
                    p.status === "rejected" ? "bg-red-100 text-red-700" :
                    "bg-amber-100 text-amber-700"
                  }`}>
                    {p.status === "confirmed" ? "✓ Confirmed" : p.status === "rejected" ? "✕ Rejected" : "⏳ Pending"}
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
