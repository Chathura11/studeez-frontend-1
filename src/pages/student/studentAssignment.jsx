import { useEffect, useState } from "react";
import axios from "axios";

export default function StudentAssignments({ classId }) {
  const [assignments, setAssignments] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/api/submission/student/classes/${classId}/assignments`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setAssignments(res.data || []));
  }, [classId]);

  return (
    <div className="bg-white rounded-xl shadow p-4">
      <h3 className="text-lg font-semibold mb-3">Assignments</h3>
      {assignments.length === 0 ? (
        <div className="text-gray-500">No assignments</div>
      ) : (
        <ul className="divide-y">
          {assignments.map((a) => (
            <li key={a._id} className="py-3">
              <div className="font-semibold">{a.title}</div>
              <div className="text-sm text-gray-600">Due: {new Date(a.dueAt).toLocaleString()}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
