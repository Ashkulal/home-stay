import { useState } from "react";

const faqs = [
  { q: "How do I book a stay?", a: "Contact us via WhatsApp at +91 9481580589 or use the contact form on our website. We'll confirm availability and guide you through the process." },
  { q: "What is the pricing?", a: "₹1,500 per person per night. This includes home-cooked meals, mountain views, and all amenities. Contact us for group discounts." },
  { q: "What are the check-in and check-out times?", a: "Check-in is at 12:00 PM (noon) and check-out is at 11:00 AM. Need early check-in or late check-out? Just ask us on WhatsApp." },
  { q: "What food is served?", a: "Authentic Malnad cuisine — breakfast, lunch, and dinner. Think dosa, idli, sambar, roti, dal, fresh coffee from our estate. Both veg and non-veg options available." },
  { q: "What amenities are available?", a: "WiFi, parking, mountain views, home-cooked food, bonfire area, garden, and nearby coffee estate walks." },
  { q: "How do I get there?", a: "We're located in the Western Ghats of Karnataka. From Bangalore, it's approximately 5-6 hours by road. Share your location on WhatsApp and we'll send you directions." },
  { q: "What is the best time to visit?", a: "October to February is the best season — cool and pleasant. Monsoon (June-September) is lush green but rainy. Summer (March-May) is warm but comfortable." },
  { q: "Are pets allowed?", a: "Yes! Pets are welcome. Please inform us in advance via WhatsApp so we can prepare." },
];

export default function FAQ() {
  const [open, setOpen] = useState(null);

  return (
    <div>
      <section className="bg-gradient-to-br from-emerald-700 to-teal-700 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Frequently Asked Questions</h1>
          <p className="text-emerald-100 text-lg">Everything you need to know about Misty Peaks</p>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 py-12">
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
    </div>
  );
}
