import { useState, useEffect } from "react";
import { admin } from "../../services/api";
import { useToast } from "../../components/Toast";
import ConfirmModal from "../../components/ConfirmModal";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();
  const [deleteModal, setDeleteModal] = useState(null);

  const loadUsers = () => {
    admin.getUsers().then(({ data }) => {
      setUsers(data.users);
    }).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { loadUsers(); }, []);

  const toggleRole = async (id, currentRole) => {
    try {
      const newRole = currentRole === "admin" ? "user" : "admin";
      await admin.updateUserRole(id, newRole);
      toast.success(`User role changed to ${newRole}`);
      loadUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update role");
    }
  };

  const deleteUser = async () => {
    try {
      await admin.deleteUser(deleteModal);
      toast.success("User deleted");
      setDeleteModal(null);
      loadUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete");
    }
  };

  if (loading) return (
    <div className="text-center py-20">
      <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 md:py-12">
      <h1 className="text-2xl md:text-3xl font-bold mb-2">Manage Users</h1>
      <p className="text-gray-500 mb-6">{users.length} registered users</p>

      <div className="space-y-3">
        {users.map((u) => (
          <div key={u.id} className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center font-bold text-sm shrink-0">
                  {u.name?.charAt(0).toUpperCase()}
                </span>
                <div className="min-w-0">
                  <p className="font-semibold truncate">{u.name}</p>
                  <p className="text-sm text-gray-400 truncate">{u.email}</p>
                </div>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-xs font-semibold shrink-0 ${
                u.role === "admin" ? "bg-purple-100 text-purple-700" : "bg-gray-100 text-gray-600"
              }`}>
                {u.role}
              </span>
            </div>
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
              <p className="text-xs text-gray-400">Joined {new Date(u.created_at).toLocaleDateString()}</p>
              <div className="flex gap-2">
                <button onClick={() => toggleRole(u.id, u.role)}
                  className="text-emerald-600 hover:text-emerald-700 text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-emerald-50 transition-colors">
                  {u.role === "admin" ? "Remove Admin" : "Make Admin"}
                </button>
                <button onClick={() => setDeleteModal(u.id)}
                  className="text-red-500 hover:text-red-700 text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors">
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {users.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl shadow-md">
          <p className="text-gray-400">No users yet</p>
        </div>
      )}

      <ConfirmModal
        isOpen={!!deleteModal}
        onClose={() => setDeleteModal(null)}
        onConfirm={deleteUser}
        title="Delete User"
        message="Are you sure you want to delete this user? This cannot be undone."
        confirmText="Yes, Delete"
        danger
      />
    </div>
  );
}
