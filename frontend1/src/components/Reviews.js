import { useState, useEffect } from "react";
import { reviews } from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function Reviews({ targetType, targetId }) {
  const [list, setList] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const { user } = useAuth();

  const loadReviews = () => {
    reviews.getAll({ target_type: targetType, target_id: targetId }).then(({ data }) => setList(data.reviews)).catch(() => {});
  };

  useEffect(() => { loadReviews(); }, [targetType, targetId]); // eslint-disable-line

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await reviews.create({ target_type: targetType, target_id: targetId, rating, comment });
      setComment("");
      setRating(5);
      loadReviews();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to submit review");
    }
  };

  const handleDelete = async (id) => {
    try {
      await reviews.delete(id);
      loadReviews();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete review");
    }
  };

  const avgRating = list.length > 0 ? (list.reduce((sum, r) => sum + r.rating, 0) / list.length).toFixed(1) : null;

  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold mb-4">
        Reviews {avgRating && <span className="text-emerald-600">({avgRating} ★)</span>}
      </h3>

      {user && (
        <form onSubmit={handleSubmit} className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex gap-2 mb-3">
            {[1, 2, 3, 4, 5].map((s) => (
              <button key={s} type="button" onClick={() => setRating(s)}
                className={`text-2xl ${s <= rating ? "text-yellow-400" : "text-gray-300"}`}>★</button>
            ))}
          </div>
          <textarea value={comment} onChange={(e) => setComment(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 mb-3" placeholder="Write your review..." rows="3" />
          <button type="submit" className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700">
            Submit Review
          </button>
        </form>
      )}

      <div className="space-y-4">
        {list.map((r) => (
          <div key={r.id} className="border-b pb-4">
            <div className="flex justify-between items-center">
              <div>
                <span className="font-semibold">{r.user_name}</span>
                <span className="text-yellow-400 ml-2">{"★".repeat(r.rating)}</span>
              </div>
              {user && user.id === r.user_id && (
                <button onClick={() => handleDelete(r.id)} className="text-red-500 text-sm hover:underline">Delete</button>
              )}
            </div>
            {r.comment && <p className="text-gray-600 mt-1">{r.comment}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
