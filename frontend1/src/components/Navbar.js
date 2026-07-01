import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-emerald-600">
          Misty Peaks
        </Link>
        <div className="flex items-center gap-4 text-sm">
          <Link to="/peaks" className="hover:text-emerald-600 transition-colors">Peaks</Link>
          <Link to="/homestays" className="hover:text-emerald-600 transition-colors">Homestays</Link>
          <Link to="/gallery" className="hover:text-emerald-600 transition-colors">Gallery</Link>
          <Link to="/about" className="hover:text-emerald-600 transition-colors">About</Link>
          <Link to="/faq" className="hover:text-emerald-600 transition-colors">FAQ</Link>
          {user ? (
            <>
              <Link to="/bookings" className="hover:text-emerald-600 transition-colors">Bookings</Link>
              <Link to="/dashboard" className="hover:text-emerald-600 transition-colors">Dashboard</Link>
              {user.role === "admin" && (
                <Link to="/admin" className="text-purple-600 hover:text-purple-800 font-semibold transition-colors">Admin</Link>
              )}
              <Link to="/profile" className="hover:text-emerald-600 transition-colors">Profile</Link>
              <button onClick={logout} className="bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700 transition-colors">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-emerald-600 transition-colors">Login</Link>
              <Link to="/register" className="bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700 transition-colors">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
