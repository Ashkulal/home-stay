import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { homestays } from "../services/api";

export default function Homestays() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minGuests, setMinGuests] = useState("");
  const [sort, setSort] = useState("");

  const loadData = () => {
    setLoading(true);
    const params = {};
    if (search) params.search = search;
    if (maxPrice) params.max_price = maxPrice;
    if (minGuests) params.min_guests = minGuests;
    if (sort) params.sort = sort;
    homestays.getAll(params).then(({ data }) => {
      setList(data.homestays);
    }).catch(() => {}).finally(() => {
      setLoading(false);
    });
  };

  useEffect(() => { loadData(); }, [sort]); // eslint-disable-line

  const handleSearch = (e) => {
    e.preventDefault();
    loadData();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-8">Homestays</h1>

      <div className="bg-white rounded-lg shadow-md p-4 mb-8">
        <form onSubmit={handleSearch} className="flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm mb-1">Search</label>
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Name or description..." className="w-full border rounded-lg px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm mb-1">Max Price/Night (₹)</label>
            <input type="number" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)}
              placeholder="e.g. 2000" className="w-full border rounded-lg px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm mb-1">Min Guests</label>
            <input type="number" value={minGuests} onChange={(e) => setMinGuests(e.target.value)}
              placeholder="e.g. 2" className="w-full border rounded-lg px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm mb-1">Sort By</label>
            <select value={sort} onChange={(e) => setSort(e.target.value)} className="border rounded-lg px-3 py-2">
              <option value="">Newest</option>
              <option value="price">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>
          <button type="submit" className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700">Search</button>
        </form>
      </div>

      {loading ? (
        <div className="text-center py-16">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
          <p className="mt-2 text-gray-500">Loading...</p>
        </div>
      ) : list.length === 0 ? (
        <p className="text-center text-gray-500 py-16">No homestays found</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-8">
          {list.map((h) => (
            <Link to={`/homestays/${h.id}`} key={h.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 transform hover:-translate-y-1">
              <div className="h-48 bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white text-6xl">
                🏠
              </div>
              <div className="p-6">
                <h2 className="text-xl font-bold mb-2">{h.name}</h2>
                <p className="text-gray-600 mb-2">{h.description}</p>
                <p className="text-emerald-600 font-bold text-lg">₹{h.price_per_night}/night</p>
                {h.max_guests && <p className="text-sm text-gray-500">Max guests: {h.max_guests}</p>}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
