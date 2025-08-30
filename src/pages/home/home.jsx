import { useEffect, useState } from "react";
import axios from "axios";

export default function HomePage() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [studentId, setStudentId] = useState(null);

  useEffect(() => {
    fetchClasses();
    getCurrentUser();
  }, []);

  const token = localStorage.getItem("token");

  const getCurrentUser = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/user/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStudentId(res.data._id);
    } catch (err) {
      console.error("Failed to fetch user:", err);
    }
  };

  const fetchClasses = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/class`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setClasses(res.data.filter((cls) => cls.isActive)); // only active
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async (classId) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/class/${classId}/request`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Enrollment request sent!");
      fetchClasses(); // refresh list
    } catch (err) {
      alert(err.response.data.message);
    }
  };

  return (
    <div className="p-8 min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
      <h1 className="text-4xl font-extrabold text-center mb-10 text-accent">
        Explore Our Classes
      </h1>

      {loading ? (
        <div className="flex justify-center items-center mt-20">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {classes.length > 0 ? (
            classes.map((cls) => {
              const alreadyEnrolled = cls.students?.some(s => s._id === studentId);
              const alreadyRequested = cls.studentRequests?.includes(studentId);

              return (
                <div
                  key={cls._id}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 p-2"
                >
                  <img
                    src={cls.imageUrl}
                    alt={cls.name}
                    className="w-full h-40 object-cover"
                  />
                  <div className="p-4 flex flex-col justify-between h-56">
                    <div>
                      <h2 className="text-l font-bold text-gray-800 mb-2">{cls.name}</h2>
                      <p className="text-gray-600 text-sm mb-1">
                        <span className="font-semibold">Grade:</span> {cls.grade}
                      </p>
                      <p className="text-gray-600 text-sm mb-1">
                        <span className="font-semibold">Subject:</span>{" "}
                        {cls.subject?.name || "-"}
                      </p>
                      <p className="text-gray-600 text-sm mb-1">
                        <span className="font-semibold">Teacher:</span>{" "}
                        {cls.teacher?.name || "-"}
                      </p>
                      <p className="text-gray-600 text-sm">
                        <span className="font-semibold">Students:</span>{" "}
                        {cls.students?.length || 0}
                      </p>
                    </div>

                    <div className="mt-4">
                      {alreadyEnrolled ? (
                        <button
                          className="w-full py-2 px-4 bg-green-500 text-white font-semibold rounded-lg cursor-not-allowed"
                          disabled
                        >
                          Enrolled
                        </button>
                      ) : alreadyRequested ? (
                        <button
                          className="w-full py-2 px-4 bg-yellow-500 text-white font-semibold rounded-lg cursor-not-allowed"
                          disabled
                        >
                          Requested
                        </button>
                      ) : (
                        <button
                          onClick={() => handleEnroll(cls._id)}
                          className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200 cursor-pointer"
                        >
                          Enroll
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="col-span-full text-center text-gray-500 italic">
              No classes available
            </p>
          )}
        </div>
      )}
    </div>
  );
}
