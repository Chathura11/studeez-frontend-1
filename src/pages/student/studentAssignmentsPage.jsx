import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function StudentAssignmentsPage() {
  const { id } = useParams(); // class id
  const navigate = useNavigate();
  const [cls, setCls] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    Promise.all([
      axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/class/${id}`, { headers: { Authorization: `Bearer ${token}` } }),
      axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/assignment/class/${id}`, { headers: { Authorization: `Bearer ${token}` } }),
    ])
      .then(([c, a]) => {
        setCls(c.data);
        setAssignments(a.data);
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
          <h1 className="text-xl font-bold">Assignments — {cls?.name}</h1>
          <Link to={`/student/class/${id}`} className="text-blue-600 underline">
            Back to Class
          </Link>
        </div>

        {assignments.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-6">
            <p className="text-gray-600">No assignments yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {assignments.map((as) => (
              <div
                key={as._id}
                className="bg-white rounded-xl shadow p-4 flex items-center justify-between"
              >
                <div>
                  <h3 className="text-lg font-semibold">{as.title}</h3>
                  <p className="text-sm text-gray-600">{as.description}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Due: {new Date(as.dueAt).toLocaleString()}
                  </p>
                  {as.attachments?.length > 0 && (
                    <div className="mt-2">
                      <p className="text-sm text-gray-700">Attachments:</p>
                      <ul className="ml-4 list-disc text-sm">
                        {as.attachments.map((url, idx) => (
                          <li key={idx}>
                            <a
                              href={url}
                              download
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              Download File {idx + 1}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}      
                </div>
                <button
                  onClick={() => navigate(`/student/assignments/${as._id}/submit`)}
                  className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 cursor-pointer"
                >
                  View
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
