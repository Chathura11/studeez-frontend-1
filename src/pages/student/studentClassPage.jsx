import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function StudentClassPage() {
  const { id } = useParams(); // class id
  const navigate = useNavigate();
  const [cls, setCls] = useState(null);
  const [status, setStatus] = useState("loading"); // enrolled | pending | not-enrolled | loading
  const [requestLoading, setRequestLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/api/class/${id}`, { headers: { Authorization: `Bearer ${token}` } })
      .then((res ) => {
        setCls(res.data);
        if (data.isStudent) setStatus("enrolled");
        else if (data.isPending) setStatus("pending");
        else setStatus("not-enrolled");
      })
      .catch(() => {})
      .finally(() => {});
  }, [id]);

  const handleRequestJoin = async () => {
    setRequestLoading(true);
    const token = localStorage.getItem("token");
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/classes/${id}/request`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStatus("pending");
    } catch (e) {
      alert(e?.response?.data?.message || "Failed to send request");
    } finally {
      setRequestLoading(false);
    }
  };

  if (!cls) return (
  <div className="p-8">
    <div className="max-w-7xl mx-auto">
    Loading...
    </div>
  </div>);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row gap-6">
          <img
            src={cls.imageUrl}
            alt={cls.name}
            className="w-full md:w-64 h-40 object-cover rounded-lg"
          />
          <div>
            <h1 className="text-2xl font-bold">{cls.name}</h1>
            <p className="text-gray-600">Grade: {cls.grade}</p>
            <p className="text-gray-600">📘 {cls.subject?.name || "-"}</p>
            <p className="text-gray-600">👨‍🏫 {cls.teacher?.name || "-"}</p>

            <div className="mt-4 flex gap-3">
              {status === "enrolled" && (
                <>
                  <span className="px-3 py-1 rounded bg-green-100 text-green-700">
                    Enrolled
                  </span>
                  <button
                    onClick={() => navigate(`/class/${id}/materials`)}
                    className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-black"
                  >
                    Open Materials
                  </button>
                  <button
                    onClick={() => navigate(`/class/${id}/assignments`)}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    View Assignments
                  </button>
                  <button
                    onClick={() => navigate(`/class/${id}/announcements`)}
                    className="px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700"
                  >
                    Announcements
                  </button>
                </>
              )}
              {status === "pending" && (
                <span className="px-3 py-1 rounded bg-yellow-100 text-yellow-700">
                  Request Pending
                </span>
              )}
              {status === "not-enrolled" && (
                <button
                  onClick={handleRequestJoin}
                  disabled={requestLoading}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-60"
                >
                  {requestLoading ? "Sending..." : "Request to Join"}
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 border-t pt-6">
          <h2 className="text-lg font-semibold mb-3">Quick Links</h2>
          <div className="flex gap-3 flex-wrap">
            <Link
              to={`/student/class/${id}/materials`}
              className="px-4 py-2 rounded bg-gray-100 hover:bg-gray-200"
            >
              Materials
            </Link>
            <Link
              to={`/student/class/${id}/assignments`}
              className="px-4 py-2 rounded bg-gray-100 hover:bg-gray-200"
            >
              Assignments
            </Link>
            <Link
              to={`/student/class/${id}/announcements`}
              className="px-4 py-2 rounded bg-gray-100 hover:bg-gray-200"
            >
              Announcements
            </Link>
            <Link
              to={`/student/class/${id}/zoomlinks`}
              className="px-4 py-2 rounded bg-gray-100 hover:bg-gray-200"
            >
              Zoom Links
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
