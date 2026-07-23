import { useState } from "react";

const PHONE = "919481580589";

export default function FloatingContact() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-6 left-4 sm:left-6 z-40 flex flex-col items-start gap-3">
      {open && (
        <>
          <a href={`https://wa.me/${PHONE}?text=Hi%2C%20I%27m%20interested%20in%20Silent%20Peak%20Kudremukh%20Homestay`}
            target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 bg-green-600 text-white px-5 py-3 rounded-full shadow-2xl hover:bg-green-500 transition-all font-medium text-sm hover:scale-105">
            <span className="text-lg">💬</span> WhatsApp
          </a>
          <a href="tel:+919481580589"
            className="flex items-center gap-2 bg-gold-500 text-forest-900 px-5 py-3 rounded-full shadow-2xl hover:bg-gold-400 transition-all font-bold text-sm hover:scale-105">
            <span className="text-lg">📞</span> Call Now
          </a>
        </>
      )}
      <button onClick={() => setOpen(!open)}
        className={`w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 ${
          open ? "bg-gray-600 hover:bg-gray-500 rotate-90" : "bg-gold-500 hover:bg-gold-400 animate-pulse"
        }`}>
        <span className="text-forest-900 text-2xl">{open ? "✕" : "📞"}</span>
      </button>
    </div>
  );
}
