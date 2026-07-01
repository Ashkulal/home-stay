import { useState, useEffect } from "react";
import { payments } from "../../services/api";

export default function AdminPayments() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = () => {
    payments.getAll().then(({ data }) => {
      setList(data.payments);
    }).catch(() => {}).finally(() => {
      setLoading(false);
    });
  };

  useEffect(() => { loadData(); }, []);

  const handleConfirm = async (id, status) => {
    try {
      await payments.confirm(id, status);
      loadData();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update payment");
    }
  };

  if (loading) return <div className="text-center py-16">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-2xl md:text-4xl font-bold mb-8">Manage Payments</h1>
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">User</th>
                <th className="text-left py-2">Homestay</th>
                <th className="text-left py-2">Amount</th>
                <th className="text-left py-2">Txn ID</th>
                <th className="text-left py-2">Proof</th>
                <th className="text-left py-2">Status</th>
                <th className="text-left py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {list.map((p) => (
                <tr key={p.id} className="border-b">
                  <td className="py-2">{p.user_name}</td>
                  <td className="py-2">{p.homestay_name}</td>
                  <td className="py-2">₹{p.amount}</td>
                  <td className="py-2 font-mono text-sm">{p.transaction_id || "N/A"}</td>
                  <td className="py-2">
                    {p.proof_url ? <a href={p.proof_url} target="_blank" rel="noreferrer" className="text-emerald-600 hover:underline">View</a> : "N/A"}
                  </td>
                  <td className="py-2">
                    <span className={`px-2 py-1 rounded text-sm ${p.status === "confirmed" ? "bg-green-100 text-green-700" : p.status === "rejected" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"}`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="py-2 space-x-2">
                    {p.status === "pending" && (
                      <>
                        <button onClick={() => handleConfirm(p.id, "confirmed")} className="text-green-600 hover:underline text-sm">Confirm</button>
                        <button onClick={() => handleConfirm(p.id, "rejected")} className="text-red-500 hover:underline text-sm">Reject</button>
                      </>
                    )}
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
