import { Link } from "react-router-dom";

const PHONE = "919481580589";

export default function Footer() {
  return (
    <footer className="bg-forest-950 border-t border-gold-500/10 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <img src="/logo.png" alt="Silent Peak" className="h-14 w-14 rounded-full object-cover border-2 border-gold-500/30" />
              <div>
                <p className="text-gold-500 font-bold text-xl tracking-wide">SILENT PEAK</p>
                <p className="text-[10px] text-gold-500/50 tracking-[0.3em]">KUDREMUKH HOMESTAY</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-md">
              A premium mountain retreat nestled in the lush green hills of Kudremukh, Karnataka. Experience nature, peace, and adventure in the heart of the Western Ghats.
            </p>
            <div className="flex gap-4 mt-6">
              <a href="https://wa.me/919481580589" target="_blank" rel="noopener noreferrer"
                className="w-10 h-10 rounded-full glass gold-border flex items-center justify-center text-green-400 hover:bg-green-600 hover:text-white hover:border-green-600 transition-all">
                💬
              </a>
              <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer"
                className="w-10 h-10 rounded-full glass gold-border flex items-center justify-center text-pink-400 hover:bg-pink-600 hover:text-white hover:border-pink-600 transition-all">
                📷
              </a>
              <a href="tel:+919481580589"
                className="w-10 h-10 rounded-full glass gold-border flex items-center justify-center text-gold-500 hover:bg-gold-500 hover:text-forest-900 hover:border-gold-500 transition-all">
                📞
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-gold-500 font-bold mb-4 tracking-wider text-sm">QUICK LINKS</h4>
            <div className="flex flex-col gap-2">
              {["Home", "About", "Gallery", "Peaks", "Activities", "Contact"].map((name) => (
                <Link key={name} to={name === "Home" ? "/" : `/${name.toLowerCase()}`}
                  className="text-gray-400 hover:text-gold-500 transition-colors text-sm">
                  {name}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-gold-500 font-bold mb-4 tracking-wider text-sm">CONTACT</h4>
            <div className="space-y-3 text-sm text-gray-400">
              <a href="tel:+919481580589" className="block hover:text-gold-500 transition-colors">📞 +91 94815 80589</a>
              <a href={`https://wa.me/${PHONE}`} target="_blank" rel="noopener noreferrer" className="block hover:text-green-400 transition-colors">💬 WhatsApp</a>
              <p className="📍">Kudremukh, Chikkamagaluru, Karnataka</p>
              <p>📧 info@silentpeak.in</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gold-500/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
          <p>&copy; {new Date().getFullYear()} Silent Peak Kudremukh Homestay. All rights reserved.</p>
          <p className="text-gold-500/40">Crafted with love for the mountains</p>
        </div>
      </div>
    </footer>
  );
}
