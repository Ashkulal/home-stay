import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { peaks } from "../services/api";
import Reviews from "../components/Reviews";

export default function PeakDetail() {
  const [peak, setPeak] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    peaks.getOne(id).then(({ data }) => setPeak(data.peak)).catch(() => setPeak(null));
  }, [id]);

  if (!peak) return <div className="text-center py-16">
    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
    <p className="mt-2 text-gray-500">Loading...</p>
  </div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="h-64 bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-8xl">
          🏔️
        </div>
        <div className="p-8">
          <h1 className="text-2xl md:text-4xl font-bold mb-4">{peak.name}</h1>
          <p className="text-gray-600 text-lg mb-2">{peak.location}</p>
          {peak.altitude_m && <p className="text-gray-500 mb-2">Altitude: {peak.altitude_m}m</p>}
          {peak.difficulty && <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-700 rounded mb-4">{peak.difficulty}</span>}
          {peak.description && <p className="text-gray-700 mt-4">{peak.description}</p>}
        </div>
      </div>
      <Reviews targetType="peak" targetId={id} />
    </div>
  );
}
