import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

export default function StudentZoomLinksPage() {
  const { id } = useParams(); // class id
  const [links, setLinks] = useState([]);
  const [cls, setCls] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    Promise.all([
      axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/class/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
      axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/zoomlink/${id}/zoom-links`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
    ])
      .then(([c, l]) => {
        setCls(c.data);
        setLinks(l.data);
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
          <h1 className="text-xl font-bold">Zoom Links — {cls?.name}</h1>
          <Link
            to={`/student/class/${id}`}
            className="text-blue-600 underline"
          >
            Back to Class
          </Link>
        </div>

        {links.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-6">
            <p className="text-gray-600">No Zoom links posted yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {links.map((link) => (
              <div
                key={link._id}
                className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition duration-300 ease-in-out flex flex-col justify-between"
              >
                <div>
                  <p className="text-sm text-gray-500 uppercase mb-1">
                    {new Date(link.date).toDateString()}
                  </p>
                  <h3 className="text-xl font-semibold mb-2 text-gray-800">{link.topic}</h3>
                  <a
                    href={link.zoomLink}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 font-medium underline truncate block mb-3 hover:text-blue-800"
                  >
                    Join Zoom
                  </a>
                  <p className="text-xs text-gray-400">
                    Posted {new Date(link.createdAt).toLocaleString()}
                  </p>
                </div>

                <div className="mt-4 flex justify-center">
                  <span
                    className={`px-4 py-1 rounded-full font-semibold text-xs ${
                      link.status === "upcoming"
                        ? "bg-orange-500 text-white"
                        : link.status === "ongoing"
                        ? "bg-green-500 text-white"
                        : "bg-red-500 text-white"
                    }`}
                  >
                    {link.status.charAt(0).toUpperCase() + link.status.slice(1)}
                  </span>
                </div>
              </div>
            ))}
          </div>

        )}
      </div>
    </div>
  );
}
