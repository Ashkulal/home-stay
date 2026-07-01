import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-emerald-600">
          Misty Peaks
        </Link>
        <button onClick={() => setOpen(!open)} className="md:hidden text-2xl text-gray-700">
          {open ? "✕" : "☰"}
        </button>
        <div className={`${open ? "flex" : "hidden"} md:flex flex-col md:flex-row items-start md:items-center gap-3 md:gap-4 text-sm absolute md:static top-14 left-0 right-0 bg-white md:bg-transparent shadow-md md:shadow-none p-4 md:p-0 z-50`}>
          <Link to="/peaks" className="hover:text-emerald-600 transition-colors" onClick={() => setOpen(false)}>Peaks</Link>
          <Link to="/homestays" className="hover:text-emerald-600 transition-colors" onClick={() => setOpen(false)}>Homestays</Link>
          <Link to="/gallery" className="hover:text-emerald-600 transition-colors" onClick={() => setOpen(false)}>Gallery</Link>
          <Link to="/about" className="hover:text-emerald-600 transition-colors" onClick={() => setOpen(false)}>About</Link>
          <Link to="/faq" className="hover:text-emerald-600 transition-colors" onClick={() => setOpen(false)}>FAQ</Link>
          {user ? (
            <>
              <Link to="/bookings" className="hover:text-emerald-600 transition-colors" onClick={() => setOpen(false)}>Bookings</Link>
              <Link to="/dashboard" className="hover:text-emerald-600 transition-colors" onClick={() => setOpen(false)}>Dashboard</Link>
              {user.role === "admin" && (
                <Link to="/admin" className="text-purple-600 hover:text-purple-800 font-semibold transition-colors" onClick={() => setOpen(false)}>Admin</Link>
              )}
              <Link to="/profile" className="hover:text-emerald-600 transition-colors" onClick={() => setOpen(false)}>Profile</Link>
              <button onClick={() => { logout(); setOpen(false); }} className="bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700 transition-colors">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-emerald-600 transition-colors" onClick={() => setOpen(false)}>Login</Link>
              <Link to="/register" className="bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700 transition-colors" onClick={() => setOpen(false)}>
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
