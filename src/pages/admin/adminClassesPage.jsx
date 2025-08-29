import { useEffect, useState } from "react";
import axios from "axios";
import mediaUpload from'../../utils/mediaUpload';

export default function AdminClassesPage() {
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [image,setImage] = useState(null);

  // New class state
  const [newClass, setNewClass] = useState({
    name: "",
    grade: "",
    subjectId: "",
    teacherId: "",
    imageUrl:""
  });

  useEffect(() => {
    fetchClasses();
    fetchSubjects();
    fetchTeachers();
  }, []);

  const fetchClasses = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/class`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setClasses(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSubjects = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/subject`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSubjects(res.data.filter((sub) => sub.isActive));
    } catch (err) {
      console.error(err);
    }
  };

  const fetchTeachers = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/user/teachers`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTeachers(res.data.filter((teacher) => teacher.isBlocked === false));
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddClass = async (e) => {
    e.preventDefault();
    if (!newClass.name || !newClass.grade || !newClass.subjectId || !newClass.teacherId) {
      setError("All fields are required");
      return;
    }
    setError("");
    const token = localStorage.getItem("token");

    let newImageUrl;
    if(image){
      newImageUrl = await mediaUpload(image[0]);
    }

    const newData = {
      name:newClass.name,
      grade:newClass.grade,
      subjectId: newClass.subjectId,
      teacherId:newClass.teacherId,
      imageUrl: newImageUrl,
    };

    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/class`, newData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setClasses((prev) => [...prev, res.data]);
      setNewClass({ name: "", grade: "", subjectId: "", teacherId: "" ,imageUrl:""});
    } catch (err) {
      console.error(err);
      setError("Failed to create class");
    }
  };

  const handleToggleStatus = async (id) => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/class/${id}/status`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchClasses();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-8 min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
      <h1 className="text-4xl font-extrabold text-center mb-10 text-accent">
        Manage Classes
      </h1>

      {/* Add Class Form */}
      <form
        onSubmit={handleAddClass}
        className="mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 bg-white p-6 rounded-lg shadow"
      >
        <input
          type="text"
          value={newClass.name}
          onChange={(e) => setNewClass({ ...newClass, name: e.target.value })}
          placeholder="Class Name"
          className="px-4 py-2 rounded-lg border border-gray-300 focus:ring w-full"
        />
        <input
          type="text"
          value={newClass.grade}
          onChange={(e) => setNewClass({ ...newClass, grade: e.target.value })}
          placeholder="Grade"
          className="px-4 py-2 rounded-lg border border-gray-300 focus:ring w-full"
        />
        <select
          value={newClass.subjectId}
          onChange={(e) => setNewClass({ ...newClass, subjectId: e.target.value })}
          className="px-4 py-2 rounded-lg border border-gray-300 focus:ring w-full"
        >
          <option value="">Select Subject</option>
          {subjects.map((subj) => (
            <option key={subj._id} value={subj._id}>
              {subj.name}
            </option>
          ))}
        </select>
        <select
          value={newClass.teacherId}
          onChange={(e) => setNewClass({ ...newClass, teacherId: e.target.value })}
          className="px-4 py-2 rounded-lg border border-gray-300 focus:ring w-full"
        >
          <option value="">Select Teacher</option>
          {teachers.map((t) => (
            <option key={t._id} value={t._id}>
              {t.name}
            </option>
          ))}
        </select>

        <input 
          type="file" 
          name="imageUrl" 
          onChange={(e)=>setImage(e.target.files)} 
          placeholder="Image URL" 
          className="w-full p-2 border rounded" 
        />

        <div className="col-span-full flex justify-end">
          <button
            type="submit"
            className="bg-[#037c6e] text-white px-6 py-2 rounded-lg shadow hover:bg-[#025043] transition"
          >
            Add Class
          </button>
        </div>
      </form>
      {error && (
        <p className="text-center text-red-500 font-medium mb-4">{error}</p>
      )}

      {/* Classes Table */}
      {loading ? (
        <div className="flex justify-center items-center mt-20">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="overflow-x-auto w-full shadow-md rounded-lg bg-white">
          <table className="min-w-full text-gray-700">
            <thead className="bg-gray-200 uppercase text-xs font-semibold">
              <tr>
                <th className="py-3 px-4 text-left">Name</th>
                <th className="py-3 px-4 text-left">Grade</th>
                <th className="py-3 px-4 text-left">Subject</th>
                <th className="py-3 px-4 text-left">Teacher</th>
                <th className="py-3 px-4 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {classes.length > 0 ? (
                classes.map((cls) => (
                  <tr
                    key={cls._id}
                    className="hover:bg-gray-50 border-b border-gray-100"
                  >
                    <td className="py-2 px-4">{cls.name}</td>
                    <td className="py-2 px-4">{cls.grade}</td>
                    <td className="py-2 px-4">{cls.subject?.name || "-"}</td>
                    <td className="py-2 px-4">{cls.teacher?.name || "-"}</td>
                    <td className="py-2 px-4">
                      <button
                        onClick={() => handleToggleStatus(cls._id)}
                        className={`px-3 py-1 rounded-lg text-white cursor-pointer ${
                          cls.isActive ? "bg-green-500" : "bg-red-500"
                        }`}
                      >
                        {cls.isActive ? "Active" : "Inactive"}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="text-center py-6 text-gray-500 italic"
                  >
                    No classes available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
