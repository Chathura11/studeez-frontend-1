import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

export default function StudentAnnouncementsPage() {
  const { id } = useParams(); // class id
  const [ann, setAnn] = useState([]);
  const [cls, setCls] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    Promise.all([
      axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/class/${id}`, { headers: { Authorization: `Bearer ${token}` } }),
      axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/announcement/class/${id}`, { headers: { Authorization: `Bearer ${token}` } }),
    ])
      .then(([c, a]) => {
        setCls(c.data);
        setAnn(a.data);
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
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold">Announcements — {cls?.name}</h1>
          <Link to={`/student/class/${id}`} className="text-blue-600 underline">
            Back to Class
          </Link>
        </div>

        <div className="space-y-4">
          {ann.length === 0 ? (
            <div className="bg-white rounded-xl shadow p-6">
              <p className="text-gray-600">No announcements yet.</p>
            </div>
          ) : (
            ann.map((a) => (
              <div key={a._id} className="bg-white rounded-xl shadow p-4">
                <p className="text-gray-800">{a.message}</p>
                <p className="text-xs text-gray-400 mt-2">
                  Posted {new Date(a.createdAt).toLocaleString()}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
