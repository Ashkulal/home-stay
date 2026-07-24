import { useState } from "react";
import { useToast } from "../components/Toast";
import { contact } from "../services/api";
import SEO from "../components/SEO";

const PHONE = "919481580589";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await contact.submit(form);
      setSubmitted(true);
      setForm({ name: "", email: "", phone: "", message: "" });
      toast.success("Message sent!");
    } catch {
      toast.error("Failed. Try WhatsApp.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-forest-950">
      <SEO title="Contact Us" description="Get in touch with Silent Peak Kudremukh Homestay. Call +91 94815 80589 or send us a message. Book your mountain retreat today." />
      <section className="relative h-[50vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?w=1600')] bg-cover bg-center" />
        <div className="absolute inset-0 bg-forest-950/70" />
        <div className="relative z-10 text-center px-4">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-4">Contact <span className="text-gold-500">Us</span></h1>
          <p className="text-gray-300 text-lg">We'd love to hear from you</p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 py-20">
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="glass rounded-3xl p-8 gold-border">
            <h3 className="text-2xl font-bold text-white mb-6">Send a Message</h3>
            {submitted ? (
              <div className="text-center py-12">
                <p className="text-gold-500 text-xl font-bold mb-2">✓ Thank you!</p>
                <p className="text-gray-400">We'll get back to you within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <input type="text" placeholder="Your Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-white border border-gold-500/20 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-gold-500 focus:outline-none transition-colors" required />
                <input type="email" placeholder="Email Address" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full bg-white border border-gold-500/20 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-gold-500 focus:outline-none transition-colors" required />
                <input type="tel" placeholder="Phone Number" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full bg-white border border-gold-500/20 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-gold-500 focus:outline-none transition-colors" />
                <textarea placeholder="Your Message" rows="5" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full bg-white border border-gold-500/20 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-gold-500 focus:outline-none transition-colors resize-none" required />
                <button type="submit" disabled={loading}
                  className="w-full bg-gold-500 text-forest-900 py-4 rounded-xl font-bold text-lg hover:bg-gold-400 transition-all disabled:opacity-50">
                  {loading ? "Sending..." : "Send Message"}
                </button>
              </form>
            )}
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <a href="tel:+919481580589"
                className="glass rounded-2xl p-6 text-center gold-border hover:bg-gold-500 transition-all duration-300 group">
                <span className="text-4xl block mb-3 group-hover:scale-110 transition-transform">📞</span>
                <p className="font-bold text-white group-hover:text-forest-900">Call Now</p>
                <p className="text-gray-400 text-xs mt-1 group-hover:text-forest-800">+91 94815 80589</p>
              </a>
              <a href={`https://wa.me/${PHONE}?text=Hi%2C%20I%27m%20interested%20in%20Silent%20Peak%20Homestay`}
                target="_blank" rel="noopener noreferrer"
                className="glass rounded-2xl p-6 text-center border border-green-500/30 hover:bg-green-600 transition-all duration-300 group">
                <span className="text-4xl block mb-3 group-hover:scale-110 transition-transform">💬</span>
                <p className="font-bold text-white group-hover:text-white">WhatsApp</p>
                <p className="text-gray-400 text-xs mt-1 group-hover:text-green-100">Chat with us</p>
              </a>
            </div>

            <div className="glass rounded-2xl p-6 gold-border space-y-4">
              <div className="flex items-center gap-3 text-gray-300 text-sm">
                <span className="text-lg">👤</span> <span>Mahesh Hosmata — Owner</span>
              </div>
              <div className="flex items-center gap-3 text-gray-300 text-sm">
                <span className="text-lg">📞</span> <a href="tel:+919481580589" className="hover:text-gold-500 transition-colors">+91 94815 80589</a>
              </div>
              <div className="flex items-center gap-3 text-gray-300 text-sm">
                <span className="text-lg">📧</span> <span>info@silentpeak.in</span>
              </div>
              <div className="flex items-center gap-3 text-gray-300 text-sm">
                <span className="text-lg">📍</span> <span>Kudremukh, Chikkamagaluru, Karnataka, India</span>
              </div>
              <div className="flex items-center gap-3 text-gray-300 text-sm">
                <span className="text-lg">📷</span> <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-gold-500 transition-colors">@silentpeakkudremukh</a>
              </div>
            </div>

            <div className="glass rounded-2xl overflow-hidden gold-border">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3885.2!2d75.27!3d13.22!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTPCsDEzJzEyLjAiTiA3NcKwMTYnMTIuMCJF!5e0!3m2!1sen!2sin!4v1234567890"
                width="100%" height="250" style={{ border: 0 }} allowFullScreen="" loading="lazy"
                title="Silent Peak Location" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
