import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { peaks } from "../services/api";

export default function Peaks() {
  const [peaksList, setPeaksList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [sort, setSort] = useState("");

  const loadPeaks = () => {
    setLoading(true);
    const params = {};
    if (search) params.search = search;
    if (difficulty) params.difficulty = difficulty;
    if (sort) params.sort = sort;
    peaks.getAll(params).then(({ data }) => {
      setPeaksList(data.peaks);
    }).catch(() => {}).finally(() => {
      setLoading(false);
    });
  };

  useEffect(() => { loadPeaks(); }, [difficulty, sort]); // eslint-disable-line

  const handleSearch = (e) => {
    e.preventDefault();
    loadPeaks();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-8">Mountain Peaks</h1>

      <div className="bg-white rounded-lg shadow-md p-4 mb-8">
        <form onSubmit={handleSearch} className="flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm mb-1">Search</label>
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Name or location..." className="w-full border rounded-lg px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm mb-1">Difficulty</label>
            <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} className="border rounded-lg px-3 py-2">
              <option value="">All</option>
              <option value="Easy">Easy</option>
              <option value="Moderate">Moderate</option>
              <option value="Hard">Hard</option>
            </select>
          </div>
          <div>
            <label className="block text-sm mb-1">Sort By</label>
            <select value={sort} onChange={(e) => setSort(e.target.value)} className="border rounded-lg px-3 py-2">
              <option value="">Newest</option>
              <option value="name">Name</option>
              <option value="altitude">Altitude</option>
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
      ) : peaksList.length === 0 ? (
        <p className="text-center text-gray-500 py-16">No peaks found</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-8">
          {peaksList.map((peak) => (
            <Link to={`/peaks/${peak.id}`} key={peak.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 transform hover:-translate-y-1">
              <div className="h-48 bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-6xl">
                🏔️
              </div>
              <div className="p-6">
                <h2 className="text-xl font-bold mb-2">{peak.name}</h2>
                <p className="text-gray-600 mb-1">{peak.location}</p>
                {peak.altitude_m && <p className="text-sm text-gray-500">Altitude: {peak.altitude_m}m</p>}
                {peak.difficulty && <span className="inline-block mt-2 px-2 py-1 bg-emerald-100 text-emerald-700 text-sm rounded">{peak.difficulty}</span>}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
