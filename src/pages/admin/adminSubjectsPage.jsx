import { useEffect, useState } from "react";
import axios from "axios";

export default function AdminSubjectsPage() {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // new subject state
  const [newSubject, setNewSubject] = useState({
    name: "",
    description: "",
  });

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = () => {
    const token = localStorage.getItem("token");
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/api/subject`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setSubjects(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  const handleAddSubject = (e) => {
    e.preventDefault();
    if (!newSubject.name) {
      setError("Name is required");
      return;
    }
    setError("");
    const token = localStorage.getItem("token");
    axios
      .post(`${import.meta.env.VITE_BACKEND_URL}/api/subject`, newSubject, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setSubjects((prev) => [...prev, res.data]);
        setNewSubject({ name: "", description: "" });
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to create subject");
      });
  };

  const toggleStatus = (id) => {
    const token = localStorage.getItem("token");
    axios
      .put(
        `${import.meta.env.VITE_BACKEND_URL}/api/subject/${id}/status`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((res) => {
        setSubjects((prev) =>
          prev.map((subject) =>
            subject._id === id ? { ...subject, isActive: !subject.isActive } : subject
          )
        );
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to update status");
      });
  };

  return (
    <div className="p-8 min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
      <h1 className="text-4xl font-extrabold text-center mb-10 text-accent">
        Manage Subjects
      </h1>

      {/* Add Subject Form */}
      <form
        onSubmit={handleAddSubject}
        className="mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 bg-white p-6 rounded-lg shadow"
      >
        <input
          type="text"
          value={newSubject.name}
          onChange={(e) =>
            setNewSubject({ ...newSubject, name: e.target.value })
          }
          placeholder="Subject name"
          className="px-4 py-2 rounded-lg border border-gray-300 focus:ring w-full"
        />
        <input
          type="text"
          value={newSubject.description}
          onChange={(e) =>
            setNewSubject({ ...newSubject, description: e.target.value })
          }
          placeholder="Description (optional)"
          className="px-4 py-2 rounded-lg border border-gray-300 focus:ring w-full"
        />
        <div className="col-span-full flex justify-end">
          <button
            type="submit"
            className="bg-[#037c6e] text-white px-6 py-2 rounded-lg shadow hover:bg-[#025043] transition"
          >
            Add Subject
          </button>
        </div>
      </form>
      {error && (
        <p className="text-center text-red-500 font-medium mb-4">{error}</p>
      )}

      {/* Subjects Table */}
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
                <th className="py-3 px-4 text-left">Description</th>
                <th className="py-3 px-4 text-left">Status</th>
                <th className="py-3 px-4 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {subjects.length > 0 ? (
                subjects.map((subject) => (
                  <tr
                    key={subject._id}
                    className="hover:bg-gray-50 border-b border-gray-100"
                  >
                    <td className="py-2 px-4">{subject.name}</td>
                    <td className="py-2 px-4">{subject.description || "-"}</td>
                    <td className="py-2 px-4">
                      {subject.isActive ? (
                        <span className="text-green-600 font-medium">Active</span>
                      ) : (
                        <span className="text-red-600 font-medium">Inactive</span>
                      )}
                    </td>
                    <td className="py-2 px-4">
                      <button
                        onClick={() => toggleStatus(subject._id)}
                        className={`px-4 py-1 rounded-lg text-white cursor-pointer ${
                          subject.isActive
                            ? "bg-red-500 hover:bg-red-600"
                            : "bg-green-500 hover:bg-green-600"
                        } transition`}
                      >
                        {subject.isActive ? "Deactivate" : "Activate"}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="4"
                    className="text-center py-6 text-gray-500 italic"
                  >
                    No subjects available
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
