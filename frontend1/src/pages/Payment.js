import { useState, useEffect } from "react";
import { payments, razorpay, bookings } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useSearchParams, Link } from "react-router-dom";
import { useToast } from "../components/Toast";

const WHATSAPP = "918660874196";
const UPI_ID = "paytmqr70c5mh@ptys";
const PAYEE_NAME = "AKASH H R";

export default function Payment() {
  const [myPayments, setMyPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [razorpayConfigured, setRazorpayConfigured] = useState(false);
  const [bookingData, setBookingData] = useState(null);
  const [searchParams] = useSearchParams();
  const bookingId = searchParams.get("booking") || "";
  const amount = searchParams.get("amount") || "";
  const { user } = useAuth();
  const toast = useToast();
  const [txnId, setTxnId] = useState("");
  const [activeTab, setActiveTab] = useState("razorpay");

  useEffect(() => {
    Promise.all([
      razorpay.getKey(),
      user ? payments.getMy() : Promise.resolve({ data: { payments: [] } }),
      bookingId ? bookings.getOne(bookingId).catch(() => ({ data: { booking: null } })) : Promise.resolve({ data: { booking: null } })
    ]).then(([keyRes, myRes, bRes]) => {
      setRazorpayConfigured(keyRes.data.configured);
      setMyPayments(myRes.data.payments);
      setBookingData(bRes.data.booking);
    }).catch(() => {}).finally(() => setLoading(false));
  }, [user, bookingId]);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]')) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleRazorpayPayment = async () => {
    if (!user || !bookingId || !amount) {
      toast.error("Missing booking or amount");
      return;
    }

    setProcessing(true);
    try {
      const { data: orderData } = await razorpay.createOrder({
        booking_id: bookingId,
        amount: parseFloat(amount)
      });

      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        toast.error("Failed to load payment gateway");
        setProcessing(false);
        return;
      }

      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Ibbani Homestay",
        description: `Booking #${bookingId}`,
        order_id: orderData.orderId,
        handler: async function (response) {
          try {
            await razorpay.verify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              booking_id: bookingId
            });
            toast.success("Payment successful! Booking confirmed.");
            const myRes = await payments.getMy();
            setMyPayments(myRes.data.payments);
          } catch (err) {
            toast.error("Payment verification failed. Contact support.");
          }
          setProcessing(false);
        },
        prefill: {
          name: user.name,
          email: user.email
        },
        theme: { color: "#059669" },
        modal: {
          ondismiss: function () {
            setProcessing(false);
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to initiate payment");
      setProcessing(false);
    }
  };

  const handleManualSubmit = async (e) => {
    e.preventDefault();
    try {
      await payments.initiate({
        booking_id: bookingId,
        amount: amount,
        transaction_id: txnId || undefined,
      });
      toast.success("Payment proof submitted! Waiting for confirmation.");
      setTxnId("");
      const myRes = await payments.getMy();
      setMyPayments(myRes.data.payments);
    } catch (err) {
      toast.error(err.response?.data?.message || "Payment failed");
    }
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
      <p className="text-gray-500 mb-8">Pay securely for your booking at Ibbani Homestay</p>

      {bookingId && amount && (
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-2xl p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-emerald-100 text-sm">Amount to Pay</p>
              <p className="text-4xl font-extrabold">₹{amount}</p>
              <p className="text-emerald-200 text-sm mt-1">Booking #{bookingId}</p>
              {bookingData && (
                <p className="text-emerald-200 text-sm">{bookingData.homestay_name} · {bookingData.guests} guests</p>
              )}
            </div>
            <div className="text-5xl">💳</div>
          </div>
        </div>
      )}

      {/* Payment Tabs */}
      {bookingId && amount && (
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
          <div className="flex border-b border-gray-100">
            <button onClick={() => setActiveTab("razorpay")}
              className={`flex-1 py-4 font-semibold text-sm transition-colors ${activeTab === "razorpay" ? "text-emerald-600 border-b-2 border-emerald-600 bg-emerald-50" : "text-gray-500 hover:text-gray-700"}`}>
              💳 Razorpay (Card/UPI/Netbanking)
            </button>
            <button onClick={() => setActiveTab("upi")}
              className={`flex-1 py-4 font-semibold text-sm transition-colors ${activeTab === "upi" ? "text-emerald-600 border-b-2 border-emerald-600 bg-emerald-50" : "text-gray-500 hover:text-gray-700"}`}>
              📱 UPI QR Code
            </button>
          </div>

          <div className="p-6 md:p-8">
            {activeTab === "razorpay" && (
              <div className="text-center">
                {razorpayConfigured ? (
                  <>
                    <div className="text-6xl mb-4">💳</div>
                    <h3 className="text-xl font-bold mb-2">Pay with Razorpay</h3>
                    <p className="text-gray-500 mb-6">Supports UPI, Credit/Debit Cards, Netbanking, and Wallets</p>
                    <button onClick={handleRazorpayPayment} disabled={processing}
                      className="bg-emerald-600 text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-emerald-700 transition-all disabled:opacity-40 shadow-lg">
                      {processing ? "Processing..." : `Pay ₹${amount}`}
                    </button>
                    <p className="text-xs text-gray-400 mt-4">Secured by Razorpay</p>
                  </>
                ) : (
                  <>
                    <div className="text-6xl mb-4">⚙️</div>
                    <h3 className="text-xl font-bold mb-2">Razorpay Not Configured</h3>
                    <p className="text-gray-500 mb-4">Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to enable online payments.</p>
                    <button onClick={() => setActiveTab("upi")} className="text-emerald-600 font-semibold hover:text-emerald-700">
                      Use UPI QR Code instead →
                    </button>
                  </>
                )}
              </div>
            )}

            {activeTab === "upi" && (
              <div className="grid md:grid-cols-2 gap-8">
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

                <div>
                  <h3 className="font-bold text-lg mb-4">Submit Payment Proof</h3>
                  {!user ? (
                    <div className="bg-gray-50 rounded-xl p-8 text-center">
                      <p className="text-gray-500 mb-4">Login to submit payment proof</p>
                      <Link to="/login" className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-semibold">Login</Link>
                    </div>
                  ) : (
                    <form onSubmit={handleManualSubmit} className="space-y-4">
                      <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                        <p className="text-sm text-blue-700 font-medium">Steps:</p>
                        <ol className="text-sm text-blue-600 mt-2 space-y-1 list-decimal list-inside">
                          <li>Open UPI app, scan QR or use UPI ID</li>
                          <li>Pay ₹{amount}</li>
                          <li>Copy the UPI Transaction ID</li>
                          <li>Paste below and submit</li>
                        </ol>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">UPI Transaction ID *</label>
                        <input type="text" value={txnId} onChange={(e) => setTxnId(e.target.value)}
                          className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 outline-none font-mono"
                          placeholder="e.g. 123456789012" required />
                      </div>
                      <button type="submit" disabled={!txnId}
                        className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-emerald-700 transition-all disabled:opacity-40 shadow-md">
                        Submit Payment Proof
                      </button>
                    </form>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* WhatsApp */}
      <div className="bg-green-50 rounded-2xl p-6 border border-green-100 mb-8">
        <div className="flex items-center gap-4">
          <span className="text-4xl">💬</span>
          <div className="flex-1">
            <h3 className="font-bold text-green-800">Need help with payment?</h3>
            <p className="text-green-600 text-sm">Chat with us on WhatsApp for instant support</p>
          </div>
          <a href={`https://wa.me/${WHATSAPP}?text=${whatsappMsg}`}
            target="_blank" rel="noopener noreferrer"
            className="bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors shrink-0">
            WhatsApp
          </a>
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
                    <p className="text-sm text-gray-500">₹{p.amount} · {p.transaction_id || "N/A"}</p>
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
