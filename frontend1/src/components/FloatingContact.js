import { useState } from "react";

const PHONE = "919481580589";

export default function FloatingContact() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-24 left-4 sm:left-6 z-40 flex flex-col items-start gap-3">
      {open && (
        <>
          <a href={`https://wa.me/${PHONE}?text=Hi%2C%20I%27m%20interested%20in%20Misty%20Peaks%20Homestay`}
            target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 bg-green-500 text-white px-4 py-3 rounded-full shadow-lg hover:bg-green-600 transition-colors font-medium text-sm">
            <span className="text-lg">💬</span> WhatsApp
          </a>
          <a href="tel:+919481580589"
            className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-3 rounded-full shadow-lg hover:bg-emerald-700 transition-colors font-medium text-sm">
            <span className="text-lg">📞</span> Call Now
          </a>
        </>
      )}
      <button
        onClick={() => setOpen(!open)}
        className={`w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 ${
          open ? "bg-gray-600 hover:bg-gray-700" : "bg-emerald-600 hover:bg-emerald-700"
        }`}
      >
        <span className="text-white text-2xl">{open ? "✕" : "📞"}</span>
      </button>
    </div>
  );
}
