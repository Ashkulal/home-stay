import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setOpen(false);
    navigate("/");
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-emerald-600 flex items-center gap-2">
          <span>🏔️</span>
          <span>Misty Peaks</span>
        </Link>
        <button onClick={() => setOpen(!open)} className="md:hidden text-2xl text-gray-700 p-1">
          {open ? "✕" : "☰"}
        </button>
        <div className={`${open ? "flex" : "hidden"} md:flex flex-col md:flex-row items-start md:items-center gap-3 md:gap-5 text-sm absolute md:static top-14 left-0 right-0 bg-white md:bg-transparent shadow-md md:shadow-none p-4 md:p-0 z-50`}>
          <Link to="/peaks" className="hover:text-emerald-600 transition-colors font-medium" onClick={() => setOpen(false)}>Peaks</Link>
          <Link to="/homestays" className="hover:text-emerald-600 transition-colors font-medium" onClick={() => setOpen(false)}>Homestays</Link>
          <Link to="/gallery" className="hover:text-emerald-600 transition-colors font-medium" onClick={() => setOpen(false)}>Gallery</Link>
          <Link to="/about" className="hover:text-emerald-600 transition-colors font-medium" onClick={() => setOpen(false)}>About</Link>
          <Link to="/contact" className="hover:text-emerald-600 transition-colors font-medium" onClick={() => setOpen(false)}>Contact</Link>
          {user ? (
            <>
              <div className="hidden md:block w-px h-5 bg-gray-200"></div>
              <Link to="/bookings" className="hover:text-emerald-600 transition-colors font-medium" onClick={() => setOpen(false)}>My Bookings</Link>
              <Link to="/dashboard" className="hover:text-emerald-600 transition-colors font-medium" onClick={() => setOpen(false)}>Dashboard</Link>
              {user.role === "admin" && (
                <Link to="/admin" className="text-purple-600 hover:text-purple-800 font-semibold transition-colors flex items-center gap-1" onClick={() => setOpen(false)}>
                  <span className="bg-purple-100 text-purple-700 text-xs px-2 py-0.5 rounded-full">Admin</span>
                </Link>
              )}
              <div className="hidden md:block w-px h-5 bg-gray-200"></div>
              <Link to="/profile" className="flex items-center gap-2 hover:text-emerald-600 transition-colors" onClick={() => setOpen(false)}>
                <span className="bg-emerald-100 text-emerald-700 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">
                  {user.name?.charAt(0).toUpperCase()}
                </span>
                <span className="font-medium hidden lg:inline">{user.name}</span>
              </Link>
              <button onClick={handleLogout} className="text-red-600 hover:text-red-700 font-medium transition-colors">
                Logout
              </button>
            </>
          ) : (
            <>
              <div className="hidden md:block w-px h-5 bg-gray-200"></div>
              <Link to="/login" className="hover:text-emerald-600 transition-colors font-medium" onClick={() => setOpen(false)}>Login</Link>
              <Link to="/register" className="bg-emerald-600 text-white px-5 py-2 rounded-lg hover:bg-emerald-700 transition-colors font-medium" onClick={() => setOpen(false)}>
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
