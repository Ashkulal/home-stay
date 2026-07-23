import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
    const [form, setForm] = useState({ name: "", email: "", password: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            await register(form.name, form.email, form.password);
            navigate("/");
        } catch (err) {
            setError(err.response?.data?.message || "Registration failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4 py-16">
            <div className="glass rounded-3xl p-8 md:p-10 w-full max-w-md gold-border">
                <div className="text-center mb-8">
                    <img src="/logo.png" alt="Silent Peak" className="w-20 h-20 mx-auto rounded-full border-2 border-gold-500/30 mb-4" />
                    <h1 className="text-3xl font-bold text-white">Create Account</h1>
                    <p className="text-gray-400 text-sm mt-2">Join us at Silent Peak</p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm mb-6">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="text" placeholder="Full Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="w-full bg-white border border-gold-500/20 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-gold-500 focus:outline-none transition-colors" required />
                    <input type="email" placeholder="Email Address" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="w-full bg-white border border-gold-500/20 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-gold-500 focus:outline-none transition-colors" required />
                    <input type="password" placeholder="Password (min 6 characters)" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
                        className="w-full bg-white border border-gold-500/20 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-gold-500 focus:outline-none transition-colors" minLength="6" required />
                    <button type="submit" disabled={loading}
                        className="w-full bg-gold-500 text-forest-900 py-3 rounded-xl font-bold hover:bg-gold-400 transition-all disabled:opacity-50">
                        {loading ? "Creating account..." : "Create Account"}
                    </button>
                </form>

                <p className="text-center text-gray-400 text-sm mt-6">
                    Already have an account? <Link to="/login" className="text-gold-500 hover:text-gold-400 font-bold">Sign In</Link>
                </p>
            </div>
        </div>
    );
}
