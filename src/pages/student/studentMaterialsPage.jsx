import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

export default function StudentMaterialsPage() {
  const { id } = useParams(); // class id
  const [materials, setMaterials] = useState([]);
  const [cls, setCls] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    Promise.all([
      axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/class/${id}`, { headers: { Authorization: `Bearer ${token}` } }),
      axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/material/class/${id}`, { headers: { Authorization: `Bearer ${token}` } }),
    ])
      .then(([c, m]) => {
        setCls(c.data);
        setMaterials(m.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
      Loading...
      </div>
    </div>);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold">Materials — {cls?.name}</h1>
          <Link to={`/student/class/${id}`} className="text-blue-600 underline">
            Back to Class
          </Link>
        </div>

        {materials.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-6">
            <p className="text-gray-600">No materials posted yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {materials.map((mat) => (
              <a
                key={mat._id}
                href={mat.fileUrl}
                target="_blank"
                rel="noreferrer"
                className="bg-white rounded-xl shadow p-4 hover:shadow-lg transition block"
              >
                <p className="text-sm text-gray-500 uppercase">{mat.type}</p>
                <h3 className="text-lg font-semibold">{mat.title}</h3>      
                <p className="text-xs text-gray-400 mt-2">
                  Posted {new Date(mat.createdAt).toLocaleString()}
                </p>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
