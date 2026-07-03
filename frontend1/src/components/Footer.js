import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-bold text-white mb-3">🏔️ Misty Peaks</h3>
            <p className="text-sm">Discover breathtaking mountain peaks and cozy homestays. Your adventure starts here.</p>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-3">Quick Links</h4>
            <div className="flex flex-col gap-2 text-sm">
              <Link to="/peaks" className="hover:text-emerald-400 transition-colors">Explore Peaks</Link>
              <Link to="/homestays" className="hover:text-emerald-400 transition-colors">Find Homestays</Link>
              <Link to="/gallery" className="hover:text-emerald-400 transition-colors">Gallery</Link>
              <Link to="/about" className="hover:text-emerald-400 transition-colors">About Us</Link>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-3">Support</h4>
            <div className="flex flex-col gap-2 text-sm">
              <Link to="/contact" className="hover:text-emerald-400 transition-colors">Contact Us</Link>
              <Link to="/faq" className="hover:text-emerald-400 transition-colors">FAQ</Link>
              <Link to="/login" className="hover:text-emerald-400 transition-colors">Login</Link>
              <Link to="/register" className="hover:text-emerald-400 transition-colors">Register</Link>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-6 text-center text-sm">
          <p>&copy; 2026 Misty Peaks. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
