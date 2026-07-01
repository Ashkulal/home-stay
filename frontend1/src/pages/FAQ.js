import { useState } from "react";

const faqs = [
  { q: "How do I book a homestay?", a: "Browse homestays, click on one you like, and click 'Book Now'. Choose your dates and submit." },
  { q: "How does UPI payment work?", a: "After booking, go to the payment page, scan the QR code, pay via any UPI app, then enter your transaction ID for confirmation." },
  { q: "Can I cancel my booking?", a: "Yes, go to your bookings page and click 'Cancel'. Payment refunds are handled manually — contact support." },
  { q: "How do I become an admin?", a: "Contact the site administrator to upgrade your account role." },
  { q: "Are the peak difficulty ratings accurate?", a: "Yes, they are based on local trekker feedback and updated regularly." },
  { q: "Can I leave a review?", a: "Yes, registered users can leave reviews and ratings on peaks and homestays." },
];

export default function FAQ() {
  const [open, setOpen] = useState(null);

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8 text-center">Frequently Asked Questions</h1>
      <div className="space-y-4">
        {faqs.map((faq, i) => (
          <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden">
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="w-full text-left px-6 py-4 flex justify-between items-center hover:bg-gray-50"
            >
              <span className="font-semibold">{faq.q}</span>
              <span className="text-emerald-600 text-xl">{open === i ? "−" : "+"}</span>
            </button>
            {open === i && (
              <div className="px-6 pb-4 text-gray-600">{faq.a}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
