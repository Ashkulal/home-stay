import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <h3 className="text-xl font-bold text-emerald-400 mb-2">Misty Peaks</h3>
        <p className="text-gray-400 mb-4">Your mountain adventure starts here</p>
        <div className="flex flex-wrap justify-center gap-4 md:gap-6 mb-4">
          <Link to="/peaks" className="hover:text-emerald-400">Peaks</Link>
          <Link to="/homestays" className="hover:text-emerald-400">Homestays</Link>
          <Link to="/gallery" className="hover:text-emerald-400">Gallery</Link>
        </div>
        <p className="text-gray-500 text-sm">&copy; 2026 Misty Peaks. All rights reserved.</p>
      </div>
    </footer>
  );
}
