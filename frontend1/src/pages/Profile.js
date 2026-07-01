import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { profile } from "../services/api";

export default function Profile() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "" });
  const [pwForm, setPwForm] = useState({ currentPassword: "", newPassword: "" });
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    if (!user) { navigate("/login"); return; }
    profile.get().then(({ data }) => {
      setForm({ name: data.user.name, email: data.user.email });
      setLoading(false);
    });
  }, [user, navigate]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setMsg("");
    try {
      const { data } = await profile.update(form);
      setMsg("Profile updated!");
      localStorage.setItem("user", JSON.stringify(data.user));
      setUser(data.user);
    } catch (err) {
      setMsg(err.response?.data?.message || "Update failed");
    }
  };

  const handlePassword = async (e) => {
    e.preventDefault();
    setMsg("");
    try {
      await profile.changePassword(pwForm);
      setMsg("Password updated!");
      setPwForm({ currentPassword: "", newPassword: "" });
    } catch (err) {
      setMsg(err.response?.data?.message || "Password update failed");
    }
  };

  if (loading) return <div className="text-center py-16">Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">My Profile</h1>
      {msg && <p className={`mb-4 ${msg.includes("failed") || msg.includes("incorrect") ? "text-red-500" : "text-emerald-600"}`}>{msg}</p>}

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>
        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Name</label>
            <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full border rounded-lg px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm mb-1">Email</label>
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full border rounded-lg px-3 py-2" />
          </div>
          <button type="submit" className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700">
            Update Profile
          </button>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Change Password</h2>
        <form onSubmit={handlePassword} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Current Password</label>
            <input type="password" value={pwForm.currentPassword} onChange={(e) => setPwForm({ ...pwForm, currentPassword: e.target.value })}
              className="w-full border rounded-lg px-3 py-2" required />
          </div>
          <div>
            <label className="block text-sm mb-1">New Password</label>
            <input type="password" value={pwForm.newPassword} onChange={(e) => setPwForm({ ...pwForm, newPassword: e.target.value })}
              className="w-full border rounded-lg px-3 py-2" required />
          </div>
          <button type="submit" className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700">
            Change Password
          </button>
        </form>
      </div>
    </div>
  );
}
