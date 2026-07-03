import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { homestays } from "../services/api";

export default function Homestays() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sort, setSort] = useState("");

  const loadData = () => {
    setLoading(true);
    const params = {};
    if (search) params.search = search;
    if (maxPrice) params.max_price = maxPrice;
    if (sort) params.sort = sort;
    homestays.getAll(params).then(({ data }) => {
      setList(data.homestays);
    }).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { loadData(); }, [sort]);

  const handleSearch = (e) => {
    e.preventDefault();
    loadData();
  };

  return (
    <div>
      <section className="bg-gradient-to-br from-emerald-700 to-teal-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">Our Homestays</h1>
          <p className="text-emerald-100 text-lg">Find the perfect mountain stay for your getaway</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-md p-4 mb-8">
          <form onSubmit={handleSearch} className="flex flex-wrap gap-4 items-end">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
              <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name or description..." className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Max ₹/Night</label>
              <input type="number" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)}
                placeholder="2000" className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sort</label>
              <select value={sort} onChange={(e) => setSort(e.target.value)} className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 outline-none">
                <option value="">Newest</option>
                <option value="price">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
            </div>
            <button type="submit" className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors font-medium">
              Search
            </button>
          </form>
        </div>

        {loading ? (
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600"></div>
          </div>
        ) : list.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">🏡</div>
            <p className="text-gray-500 text-lg">No homestays found</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {list.map((h) => (
              <Link to={`/homestays/${h.id}`} key={h.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group">
                <div className="h-52 bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-6xl relative group-hover:scale-105 transition-transform duration-300">
                  🏡
                  <div className="absolute top-3 right-3 bg-white/90 text-emerald-700 px-3 py-1 rounded-full font-bold text-sm shadow">
                    ₹{h.price_per_night}/night
                  </div>
                </div>
                <div className="p-5">
                  <h2 className="text-xl font-bold mb-2 group-hover:text-emerald-600 transition-colors">{h.name}</h2>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{h.description || "A beautiful homestay in the mountains"}</p>
                  <div className="flex flex-wrap gap-2 text-xs">
                    {h.max_guests && <span className="bg-gray-100 px-2 py-1 rounded-full">👥 {h.max_guests} guests</span>}
                    {h.check_in_time && <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-full">In: {h.check_in_time}</span>}
                    {h.check_out_time && <span className="bg-orange-50 text-orange-700 px-2 py-1 rounded-full">Out: {h.check_out_time}</span>}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
