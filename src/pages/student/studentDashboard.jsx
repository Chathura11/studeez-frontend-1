import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function StudentDashboard() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/api/student/my-classes`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) =>{
        setClasses(res.data)
       })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-14 h-14 border-4 border-gray-300 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">🎓 Student Dashboard</h1>

        {classes.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-6">
            <p className="text-gray-600">
              You are not enrolled in any classes yet. Browse the{" "}
              <Link to="/classes" className="text-blue-600 underline">
                classes page
              </Link>{" "}
              and request to join a class.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {classes&&classes.map((cls) => (
              <Link
                to={`/student/class/${cls._id}`}
                key={cls._id}
                className="bg-white rounded-xl shadow hover:shadow-lg transition p-4"
              >
                <img
                  src={cls.imageUrl}
                  alt={cls.name}
                  className="w-full h-36 object-cover rounded-lg mb-4"
                />
                <h2 className="text-lg font-semibold">{cls.name}</h2>
                <p className="text-sm text-gray-500">Grade {cls.grade}</p>
                <p className="text-sm text-gray-600 mt-1">
                  📘 {cls.subject?.name || "-"}
                </p>
                <p className="text-sm text-gray-600">
                  👨‍🏫 {cls.teacher?.name || "-"}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
