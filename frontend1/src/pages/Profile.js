import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { profile } from "../services/api";
import { useToast } from "../components/Toast";

export default function Profile() {
  const { user, setUser } = useAuth();
  const [form, setForm] = useState({ name: "", email: "" });
  const [pwForm, setPwForm] = useState({ currentPassword: "", newPassword: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const toast = useToast();

  useEffect(() => {
    profile.get().then(({ data }) => {
      setForm({ name: data.user.name, email: data.user.email });
      setLoading(false);
    });
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await profile.update(form);
      toast.success("Profile updated!");
      localStorage.setItem("user", JSON.stringify(data.user));
      setUser(data.user);
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    }
    setSaving(false);
  };

  const handlePassword = async (e) => {
    e.preventDefault();
    if (pwForm.newPassword.length < 6) {
      toast.error("New password must be at least 6 characters");
      return;
    }
    setSaving(true);
    try {
      await profile.changePassword(pwForm);
      toast.success("Password updated!");
      setPwForm({ currentPassword: "", newPassword: "" });
    } catch (err) {
      toast.error(err.response?.data?.message || "Password update failed");
    }
    setSaving(false);
  };

  if (loading) return <div className="text-center py-16"><div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600"></div></div>;

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">My Profile</h1>

      <div className="bg-white rounded-xl shadow-md p-6 md:p-8 mb-6">
        <div className="flex items-center gap-4 mb-6">
          <span className="bg-emerald-100 text-emerald-700 w-14 h-14 rounded-full flex items-center justify-center font-bold text-2xl">
            {user.name?.charAt(0).toUpperCase()}
          </span>
          <div>
            <p className="font-semibold text-lg">{user.name}</p>
            <p className="text-gray-500">{user.email}</p>
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{user.role}</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6 md:p-8 mb-6">
        <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>
        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500 outline-none" required minLength={2} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500 outline-none" required />
          </div>
          <button type="submit" disabled={saving} className="bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors disabled:opacity-50">
            {saving ? "Saving..." : "Update Profile"}
          </button>
        </form>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6 md:p-8">
        <h2 className="text-xl font-semibold mb-4">Change Password</h2>
        <form onSubmit={handlePassword} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
            <input type="password" value={pwForm.currentPassword} onChange={(e) => setPwForm({ ...pwForm, currentPassword: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500 outline-none" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
            <input type="password" value={pwForm.newPassword} onChange={(e) => setPwForm({ ...pwForm, newPassword: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500 outline-none" required minLength={6} />
          </div>
          <button type="submit" disabled={saving} className="bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors disabled:opacity-50">
            {saving ? "Updating..." : "Change Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
