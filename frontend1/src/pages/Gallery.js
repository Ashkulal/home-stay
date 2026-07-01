import { useState, useEffect } from "react";
import { gallery } from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function Gallery() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ title: "", image_url: "" });
  const [showForm, setShowForm] = useState(false);
  const { user } = useAuth();

  const loadImages = async () => {
    try {
      const { data } = await gallery.getAll();
      setImages(data.images);
    } catch {} finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadImages(); }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    try {
      await gallery.upload(form);
      setForm({ title: "", image_url: "" });
      setShowForm(false);
      loadImages();
    } catch (err) {
      alert(err.response?.data?.message || "Upload failed");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this image?")) return;
    await gallery.delete(id);
    loadImages();
  };

  if (loading) return <div className="text-center py-16">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Gallery</h1>
        {user && (
          <button onClick={() => setShowForm(!showForm)} className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700">
            {showForm ? "Cancel" : "Upload Image"}
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleUpload} className="bg-white rounded-lg shadow-md p-6 mb-8 max-w-xl">
          <input type="text" placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full border rounded-lg px-3 py-2 mb-4" required />
          <input type="url" placeholder="Image URL" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} className="w-full border rounded-lg px-3 py-2 mb-4" required />
          <button type="submit" className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700">Upload</button>
        </form>
      )}

      <div className="grid md:grid-cols-3 gap-6">
        {images.map((img) => (
          <div key={img.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <img src={img.image_url} alt={img.title} className="w-full h-48 object-cover" />
            <div className="p-4 flex justify-between items-center">
              <h3 className="font-semibold">{img.title}</h3>
              {user && (
                <button onClick={() => handleDelete(img.id)} className="text-red-500 hover:text-red-700 text-sm">Delete</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
