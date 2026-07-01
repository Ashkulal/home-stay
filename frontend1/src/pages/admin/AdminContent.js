import { useState, useEffect } from "react";
import { peaks, homestays } from "../../services/api";

export default function AdminContent() {
  const [peaksList, setPeaksList] = useState([]);
  const [homestaysList, setHomestaysList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("peaks");

  const [peakForm, setPeakForm] = useState({ name: "", location: "", altitude_m: "", difficulty: "", description: "" });
  const [homestayForm, setHomestayForm] = useState({ name: "", description: "", price_per_night: "", max_guests: "" });

  const loadData = () => {
    Promise.all([peaks.getAll(), homestays.getAll()]).then(([p, h]) => {
      setPeaksList(p.data.peaks);
      setHomestaysList(h.data.homestays);
    }).catch(() => {}).finally(() => {
      setLoading(false);
    });
  };

  useEffect(() => { loadData(); }, []);

  const createPeak = async (e) => {
    e.preventDefault();
    try {
      await peaks.create(peakForm);
      setPeakForm({ name: "", location: "", altitude_m: "", difficulty: "", description: "" });
      loadData();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create peak");
    }
  };

  const deletePeak = async (id) => {
    if (!window.confirm("Delete this peak?")) return;
    try {
      await peaks.delete(id);
      loadData();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete peak");
    }
  };

  const createHomestay = async (e) => {
    e.preventDefault();
    try {
      await homestays.create(homestayForm);
      setHomestayForm({ name: "", description: "", price_per_night: "", max_guests: "" });
      loadData();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create homestay");
    }
  };

  const deleteHomestay = async (id) => {
    if (!window.confirm("Delete this homestay?")) return;
    try {
      await homestays.delete(id);
      loadData();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete homestay");
    }
  };

  if (loading) return <div className="text-center py-16">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-2xl md:text-4xl font-bold mb-8">Manage Content</h1>

      <div className="flex gap-4 mb-8">
        <button onClick={() => setTab("peaks")} className={`px-4 py-2 rounded ${tab === "peaks" ? "bg-emerald-600 text-white" : "bg-gray-200"}`}>Peaks</button>
        <button onClick={() => setTab("homestays")} className={`px-4 py-2 rounded ${tab === "homestays" ? "bg-emerald-600 text-white" : "bg-gray-200"}`}>Homestays</button>
      </div>

      {tab === "peaks" && (
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Add Peak</h2>
            <form onSubmit={createPeak} className="space-y-3">
              <input placeholder="Name" value={peakForm.name} onChange={(e) => setPeakForm({ ...peakForm, name: e.target.value })} className="w-full border rounded-lg px-3 py-2" required />
              <input placeholder="Location" value={peakForm.location} onChange={(e) => setPeakForm({ ...peakForm, location: e.target.value })} className="w-full border rounded-lg px-3 py-2" required />
              <input placeholder="Altitude (m)" type="number" value={peakForm.altitude_m} onChange={(e) => setPeakForm({ ...peakForm, altitude_m: e.target.value })} className="w-full border rounded-lg px-3 py-2" />
              <input placeholder="Difficulty" value={peakForm.difficulty} onChange={(e) => setPeakForm({ ...peakForm, difficulty: e.target.value })} className="w-full border rounded-lg px-3 py-2" />
              <textarea placeholder="Description" value={peakForm.description} onChange={(e) => setPeakForm({ ...peakForm, description: e.target.value })} className="w-full border rounded-lg px-3 py-2" />
              <button type="submit" className="w-full bg-emerald-600 text-white py-2 rounded-lg hover:bg-emerald-700">Add Peak</button>
            </form>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Existing Peaks</h2>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {peaksList.map((p) => (
                <div key={p.id} className="flex justify-between items-center border-b pb-2">
                  <div>
                    <p className="font-semibold">{p.name}</p>
                    <p className="text-sm text-gray-500">{p.location}</p>
                  </div>
                  <button onClick={() => deletePeak(p.id)} className="text-red-500 hover:underline text-sm">Delete</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === "homestays" && (
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Add Homestay</h2>
            <form onSubmit={createHomestay} className="space-y-3">
              <input placeholder="Name" value={homestayForm.name} onChange={(e) => setHomestayForm({ ...homestayForm, name: e.target.value })} className="w-full border rounded-lg px-3 py-2" required />
              <input placeholder="Price per night" type="number" value={homestayForm.price_per_night} onChange={(e) => setHomestayForm({ ...homestayForm, price_per_night: e.target.value })} className="w-full border rounded-lg px-3 py-2" required />
              <input placeholder="Max guests" type="number" value={homestayForm.max_guests} onChange={(e) => setHomestayForm({ ...homestayForm, max_guests: e.target.value })} className="w-full border rounded-lg px-3 py-2" />
              <textarea placeholder="Description" value={homestayForm.description} onChange={(e) => setHomestayForm({ ...homestayForm, description: e.target.value })} className="w-full border rounded-lg px-3 py-2" />
              <button type="submit" className="w-full bg-emerald-600 text-white py-2 rounded-lg hover:bg-emerald-700">Add Homestay</button>
            </form>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Existing Homestays</h2>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {homestaysList.map((h) => (
                <div key={h.id} className="flex justify-between items-center border-b pb-2">
                  <div>
                    <p className="font-semibold">{h.name}</p>
                    <p className="text-sm text-gray-500">₹{h.price_per_night}/night</p>
                  </div>
                  <button onClick={() => deleteHomestay(h.id)} className="text-red-500 hover:underline text-sm">Delete</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
