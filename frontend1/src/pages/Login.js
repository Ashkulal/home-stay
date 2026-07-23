import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
    const [form, setForm] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            await login(form.email, form.password);
            navigate("/");
        } catch (err) {
            setError(err.response?.data?.message || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4 py-16">
            <div className="glass rounded-3xl p-8 md:p-10 w-full max-w-md gold-border">
                <div className="text-center mb-8">
                    <img src="/logo.png" alt="Silent Peak" className="w-20 h-20 mx-auto rounded-full border-2 border-gold-500/30 mb-4" />
                    <h1 className="text-3xl font-bold text-white">Welcome Back</h1>
                    <p className="text-gray-400 text-sm mt-2">Sign in to your account</p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm mb-6">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="email" placeholder="Email Address" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="w-full bg-forest-900/50 border border-gold-500/20 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-gold-500 focus:outline-none transition-colors" required />
                    <input type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
                        className="w-full bg-forest-900/50 border border-gold-500/20 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-gold-500 focus:outline-none transition-colors" required />
                    <button type="submit" disabled={loading}
                        className="w-full bg-gold-500 text-forest-900 py-3 rounded-xl font-bold hover:bg-gold-400 transition-all disabled:opacity-50">
                        {loading ? "Signing in..." : "Sign In"}
                    </button>
                </form>

                <p className="text-center text-gray-400 text-sm mt-6">
                    Don't have an account? <Link to="/register" className="text-gold-500 hover:text-gold-400 font-bold">Register</Link>
                </p>
            </div>
        </div>
    );
}
