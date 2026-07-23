import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div className="md:col-span-2">
            <h3 className="text-xl font-bold text-white mb-3">🏔️ Misty Peaks</h3>
            <p className="text-sm leading-relaxed">A cozy mountain homestay in Karnataka offering authentic hospitality, home-cooked food, and stunning mountain views. Your perfect escape in the Western Ghats.</p>
            <div className="flex gap-4 mt-4">
              <a href="https://wa.me/918660874196" target="_blank" rel="noopener noreferrer" className="bg-gray-800 hover:bg-emerald-600 w-10 h-10 rounded-full flex items-center justify-center transition-colors">
                <span className="text-sm">💬</span>
              </a>
              <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="bg-gray-800 hover:bg-pink-600 w-10 h-10 rounded-full flex items-center justify-center transition-colors">
                <span className="text-sm">📷</span>
              </a>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-3">Quick Links</h4>
            <div className="flex flex-col gap-2 text-sm">
              <Link to="/" className="hover:text-emerald-400 transition-colors">Home</Link>
              <Link to="/about" className="hover:text-emerald-400 transition-colors">About</Link>
              <Link to="/gallery" className="hover:text-emerald-400 transition-colors">Gallery</Link>
              <Link to="/faq" className="hover:text-emerald-400 transition-colors">FAQ</Link>
              <Link to="/contact" className="hover:text-emerald-400 transition-colors">Contact</Link>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
          <p>&copy; 2026 Misty Peaks. All rights reserved.</p>
          <p>Made with ❤️ for mountain lovers</p>
        </div>
      </div>
    </footer>
  );
}
