import { useState } from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-xl md:text-2xl font-extrabold text-emerald-700 flex items-center gap-2">
          <span className="bg-emerald-100 w-9 h-9 rounded-lg flex items-center justify-center text-lg">🏔️</span>
          <span>Misty Peaks</span>
        </Link>
        <button onClick={() => setOpen(!open)} className="md:hidden text-2xl text-gray-700 p-1">
          {open ? "✕" : "☰"}
        </button>
        <div className={`${open ? "flex" : "hidden"} md:flex flex-col md:flex-row items-start md:items-center gap-3 md:gap-6 text-sm absolute md:static top-14 left-0 right-0 bg-white md:bg-transparent shadow-md md:shadow-none p-4 md:p-0 z-50`}>
          <Link to="/" className="hover:text-emerald-600 transition-colors font-medium" onClick={() => setOpen(false)}>Home</Link>
          <Link to="/about" className="hover:text-emerald-600 transition-colors font-medium" onClick={() => setOpen(false)}>About</Link>
          <Link to="/gallery" className="hover:text-emerald-600 transition-colors font-medium" onClick={() => setOpen(false)}>Gallery</Link>
          <Link to="/faq" className="hover:text-emerald-600 transition-colors font-medium" onClick={() => setOpen(false)}>FAQ</Link>
          <Link to="/contact" className="hover:text-emerald-600 transition-colors font-medium" onClick={() => setOpen(false)}>Contact</Link>
          <a href="https://wa.me/918660874196?text=Hi%2C%20I%27m%20interested%20in%20Misty%20Peaks%20Homestay"
            target="_blank" rel="noopener noreferrer"
            className="bg-emerald-600 text-white px-5 py-2 rounded-lg hover:bg-emerald-700 transition-colors font-medium"
            onClick={() => setOpen(false)}>
            WhatsApp Us
          </a>
        </div>
      </div>
    </nav>
  );
}
