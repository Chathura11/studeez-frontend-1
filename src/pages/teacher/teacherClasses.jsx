import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function TeacherClasses() {
  const [classes, setClasses] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/api/teacher/classes`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setClasses(res.data || []))
      .catch(() => {});
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">My Classes</h1>
      {classes.length === 0 ? (
        <div className="text-gray-500">No classes yet.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {classes.map((cls) => (
            <Link
              key={cls._id}
              to={`/teacher/classes/${cls._id}`}
              className="bg-white rounded-xl shadow p-4 hover:shadow-md transition"
            >
              <img src={cls.imageUrl} className="w-full h-40 rounded-lg object-cover mb-3" />
              <div className="text-sm text-gray-500">{cls.subject?.name}</div>
              <div className="text-lg font-semibold">{cls.name}</div>
              <div className="text-gray-600">Grade {cls.grade}</div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
