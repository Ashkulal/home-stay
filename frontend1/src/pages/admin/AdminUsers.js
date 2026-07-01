import { useState, useEffect } from "react";
import { admin } from "../../services/api";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadUsers = () => {
    admin.getUsers().then(({ data }) => {
      setUsers(data.users);
    }).catch(() => {}).finally(() => {
      setLoading(false);
    });
  };

  useEffect(() => { loadUsers(); }, []);

  const toggleRole = async (id, currentRole) => {
    try {
      const newRole = currentRole === "admin" ? "user" : "admin";
      await admin.updateUserRole(id, newRole);
      loadUsers();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update role");
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    try {
      await admin.deleteUser(id);
      loadUsers();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete user");
    }
  };

  if (loading) return <div className="text-center py-16">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-2xl md:text-4xl font-bold mb-8">Manage Users</h1>
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Name</th>
                <th className="text-left py-2">Email</th>
                <th className="text-left py-2">Role</th>
                <th className="text-left py-2">Joined</th>
                <th className="text-left py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b">
                  <td className="py-2">{u.name}</td>
                  <td className="py-2">{u.email}</td>
                  <td className="py-2">
                    <span className={`px-2 py-1 rounded text-sm ${u.role === "admin" ? "bg-purple-100 text-purple-700" : "bg-gray-100 text-gray-700"}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="py-2">{new Date(u.created_at).toLocaleDateString()}</td>
                  <td className="py-2 space-x-2">
                    <button onClick={() => toggleRole(u.id, u.role)} className="text-emerald-600 hover:underline text-sm">
                      {u.role === "admin" ? "Remove Admin" : "Make Admin"}
                    </button>
                    <button onClick={() => deleteUser(u.id)} className="text-red-500 hover:underline text-sm">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
