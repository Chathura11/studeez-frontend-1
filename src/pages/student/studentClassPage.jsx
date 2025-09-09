import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css"; // default styles

export default function StudentClassPage() {
  const { id } = useParams(); // class id
  const navigate = useNavigate();
  const [cls, setCls] = useState(null);
  const [status, setStatus] = useState("loading"); // enrolled | pending | not-enrolled | loading
  const [requestLoading, setRequestLoading] = useState(false);
  const [assignments, setAssignments] = useState([]);
  const [zoomLinks, setZoomLinks] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/api/class/${id}`, { headers: { Authorization: `Bearer ${token}` } })
      .then((res ) => {
        setCls(res.data);
      })
      .catch(() => {})
      .finally(() => {});

    // fetch assignments
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/api/assignment/class/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setAssignments(res.data))
      .catch(() => {});

    // fetch zoom links
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/api/zoomlink/${id}/zoom-links`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setZoomLinks(res.data))
      .catch(() => {});

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

  // prepare marked dates
  const assignmentDates = assignments.map((a) =>
    new Date(a.dueAt).toDateString()
  );
  const zoomDates = zoomLinks.map((z) =>
    new Date(z.date).toDateString()
  );

  const tileClassName = ({ date }) => {
    const dateStr = date.toDateString();
  
    // ✅ Both assignment + zoom
    if (assignmentDates.includes(dateStr) && zoomDates.includes(dateStr)) {
      return "!bg-purple-300 !text-purple-900 font-bold rounded-full"; 
      // merged → purple
    }
  
    // ✅ Only assignment
    if (assignmentDates.includes(dateStr)) {
      return "!bg-blue-200 !text-blue-800 font-bold rounded-full"; 
    }
  
    // ✅ Only zoom
    if (zoomDates.includes(dateStr)) {
      return "!bg-green-200 !text-green-800 font-bold rounded-full"; 
    }
  
    return "";
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

        {/* Calendar Section */}
        <div className="mt-10 border-t pt-6">
          <h2 className="text-lg font-semibold mb-3">Class Calendar</h2>
          <Calendar tileClassName={tileClassName} />
          <div className="mt-4 flex gap-4 text-sm">
            <span className="px-3 py-1 bg-blue-200 rounded-full">Assignments</span>
            <span className="px-3 py-1 bg-green-200 rounded-full">Zoom Links</span>
            <span className="px-3 py-1 bg-purple-200 rounded-full">Both</span>
          </div>
        </div>

      </div>
    </div>
  );
}
