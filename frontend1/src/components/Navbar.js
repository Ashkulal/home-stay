import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PHONE = "919481580589";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { to: "/", label: "Home" },
    { to: "/about", label: "About" },
    { to: "/gallery", label: "Gallery" },
    { to: "/peaks", label: "Peaks" },
    { to: "/activities", label: "Activities" },
    { to: "/contact", label: "Contact" },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled ? "glass shadow-2xl py-2" : "bg-transparent py-4"
    }`}>
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-3">
          <img src="/logo.png" alt="Silent Peak" className="h-12 w-12 rounded-full object-cover border-2 border-gold-500/40" />
          <div className="hidden sm:block">
            <p className="text-gold-500 font-bold text-lg leading-tight tracking-wide">SILENT PEAK</p>
            <p className="text-[10px] text-gold-500/60 tracking-[0.3em] uppercase">Kudremukh Homestay</p>
          </div>
        </Link>

        <button onClick={() => setOpen(!open)} className="md:hidden text-gold-500 text-2xl p-2">
          {open ? "✕" : "☰"}
        </button>

        <div className={`${open ? "flex" : "hidden"} md:flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-6 text-sm absolute md:static top-full left-0 right-0 glass md:bg-transparent md:border-0 p-4 md:p-0`}>
          {links.map((l) => (
            <Link key={l.to} to={l.to}
              className="text-gray-300 hover:text-gold-500 transition-colors font-medium tracking-wide"
              onClick={() => setOpen(false)}>
              {l.label}
            </Link>
          ))}

          <div className="flex gap-2 mt-2 md:mt-0 items-center">
            <a href="tel:+919481580589"
              className="bg-gold-500/10 text-gold-500 border border-gold-500/30 px-3 py-2 rounded-full hover:bg-gold-500 hover:text-forest-900 transition-all font-medium text-xs tracking-wider">
              📞 CALL
            </a>
            <a href={`https://wa.me/${PHONE}?text=Hi%2C%20I%27m%20interested%20in%20Silent%20Peak%20Kudremukh%20Homestay`}
              target="_blank" rel="noopener noreferrer"
              className="bg-green-600/20 text-green-400 border border-green-500/30 px-3 py-2 rounded-full hover:bg-green-600 hover:text-white transition-all font-medium text-xs tracking-wider">
              💬 WHATSAPP
            </a>

            {user ? (
              <>
                <div className="hidden md:block w-px h-5 bg-gold-500/20"></div>
                <div className="flex items-center gap-2">
                  <span className="bg-gold-500/20 text-gold-500 w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs border border-gold-500/30">
                    {user.name?.charAt(0).toUpperCase()}
                  </span>
                  <button onClick={logout} className="text-gray-400 hover:text-red-400 text-xs transition-colors">
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="hidden md:block w-px h-5 bg-gold-500/20"></div>
                <Link to="/login" className="text-gray-300 hover:text-gold-500 transition-colors text-xs font-medium"
                  onClick={() => setOpen(false)}>Login</Link>
                <Link to="/register" className="bg-gold-500 text-forest-900 px-3 py-2 rounded-full hover:bg-gold-400 transition-all font-bold text-xs"
                  onClick={() => setOpen(false)}>Register</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
