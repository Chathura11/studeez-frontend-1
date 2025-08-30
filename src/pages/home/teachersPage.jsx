import React, { useEffect, useState } from "react";
import axios from "axios";

const TeachersPage = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/user`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Filter teachers
        const teachersData = res.data.filter(
          (user) => user.role && user.role.toLowerCase() === "teacher"
        );
        setTeachers(teachersData);
      } catch (err) {
        console.error("Error fetching teachers:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTeachers();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-500">
        Loading teachers...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-4xl font-extrabold text-center mb-10 text-accent">
        Our Teachers
      </h1>

      {teachers.length === 0 ? (
        <p className="text-center text-gray-500">No teachers found.</p>
      ) : (
        <div className="bg-white shadow rounded-xl divide-y">
          {teachers.map((teacher) => (
            <div
              key={teacher._id}
              className="flex items-center gap-4 p-4 hover:bg-gray-50 transition"
            >
              {/* Profile Picture */}
              {teacher.profilePicture ? (
                <img
                  src={teacher.profilePicture}
                  alt={teacher.name}
                  className="w-14 h-14  object-cover border-accent border-2 rounded-sm"
                />
              ) : (
                <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg border">
                  {teacher.name?.charAt(0)}
                </div>
              )}

              {/* Teacher Info */}
              <div className="flex-1">
                <div className="flex flex-row items-end space-x-2">
                  <h2 className="text-lg font-semibold text-gray-800">
                    {teacher.name}
                  </h2>
                  <p className="text-sm text-gray-400">{`${teacher.qualification ? "(" + teacher.qualification +")" : ''}`}</p>
                </div>
                <p className="text-sm text-gray-400">{teacher.email}</p>
                <p className="text-sm text-gray-400">{teacher.contactNo}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TeachersPage;
