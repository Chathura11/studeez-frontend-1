import { useEffect, useState } from "react";
import axios from "axios";
import mediaUpload from'../../utils/mediaUpload';

export default function AdminTeachersPage() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [image,setImage] = useState(null);

  // New teacher state
  const [newTeacher, setNewTeacher] = useState({
    name: "",
    email: "",
    password: "",
    profilePicture: "",
    contactNo:"",
    qualification:""
  });

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = () => {
    const token = localStorage.getItem("token");
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/api/user/teachers`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setTeachers(res.data);
        setLoading(false);
        console.log(res.data);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to fetch teachers");
        setLoading(false);
      });
  };

  const handleAddTeacher = async (e) => {
    e.preventDefault();
    if (!newTeacher.name || !newTeacher.email || !newTeacher.password) {
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
      name:newTeacher.name,
      email:newTeacher.email,
      password: newTeacher.password,
      profilePicture: newImageUrl,
      contactNo:newTeacher.contactNo,
      qualification:newTeacher.qualification
    };


    axios
      .post(`${import.meta.env.VITE_BACKEND_URL}/api/user/teacher`, newData, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setTeachers((prev) => [...prev, res.data]);
        setNewTeacher({ name: "", email: "", password: "",profilePicture:"" ,contactNo:"",qualification:""});
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to create teacher");
      });
  };

  const toggleBlock = (email) => {
    const token = localStorage.getItem("token");
    axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/user/${email}/block`,{},{headers:{
        Authorization:`Bearer ${token}`
    }}).then((res)=>{

        fetchTeachers();
    }).catch((error)=>{
        console.log(error);
    })
  };

  return (
    <div className="p-8 min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
      <h1 className="text-4xl font-extrabold text-center mb-10 text-accent">
        Manage Teachers
      </h1>

      {/* Add Teacher Form */}
      <form
        onSubmit={handleAddTeacher}
        className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4 bg-white p-6 rounded-lg shadow"
      >
        <input
          type="text"
          value={newTeacher.name}
          onChange={(e) =>
            setNewTeacher({ ...newTeacher, name: e.target.value })
          }
          placeholder="Teacher name"
          className="px-4 py-2 rounded-lg border border-gray-300 focus:ring w-full"
        />
        <input
          type="email"
          value={newTeacher.email}
          onChange={(e) =>
            setNewTeacher({ ...newTeacher, email: e.target.value })
          }
          placeholder="Email"
          className="px-4 py-2 rounded-lg border border-gray-300 focus:ring w-full"
        />
        <input
          type="password"
          value={newTeacher.password}
          onChange={(e) =>
            setNewTeacher({ ...newTeacher, password: e.target.value })
          }
          placeholder="Password"
          className="px-4 py-2 rounded-lg border border-gray-300 focus:ring w-full"
        />
        <input
          type="text"
          value={newTeacher.contactNo}
          onChange={(e) =>
            setNewTeacher({ ...newTeacher, contactNo: e.target.value })
          }
          placeholder="contact No"
          className="px-4 py-2 rounded-lg border border-gray-300 focus:ring w-full"
        />
        <input
          type="text"
          value={newTeacher.qualification}
          onChange={(e) =>
            setNewTeacher({ ...newTeacher, qualification: e.target.value })
          }
          placeholder="Qualification"
          className="px-4 py-2 rounded-lg border border-gray-300 focus:ring w-full"
        />
        <input 
          type="file" 
          name="profilePicture" 
          onChange={(e)=>setImage(e.target.files)} 
          placeholder="Profile Picture URL" 
          className="w-full p-2 border rounded" 
        />
        <div className="col-span-full flex justify-end">
          <button
            type="submit"
            className="bg-[#037c6e] text-white px-6 py-2 rounded-lg shadow hover:bg-[#025043] transition"
          >
            Add Teacher
          </button>
        </div>
      </form>

      {error && (
        <p className="text-center text-red-500 font-medium mb-4">{error}</p>
      )}

      {/* Teachers Table */}
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
                <th className="py-3 px-4 text-left">Email</th>
                <th className="py-3 px-4 text-left">Contact No</th>
                <th className="py-3 px-4 text-left">Qualification</th>
                <th className="py-3 px-4 text-left">Blocked</th>
                <th className="py-3 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {teachers.length > 0 ? (
                teachers.map((teacher) => (
                  <tr
                    key={teacher._id}
                    className="hover:bg-gray-50 border-b border-gray-100"
                  >
                    <td className="py-2 px-4">{teacher.name}</td>
                    <td className="py-2 px-4">{teacher.email}</td>
                    <td className="py-2 px-4">{teacher.contactNo}</td>
                    <td className="py-2 px-4">{teacher.qualification}</td>
                    <td className="py-2 px-4">
                      {teacher.isBlocked ? "Yes" : "No"}
                    </td>
                    <td className="py-2 px-4">
                      <button
                        onClick={() =>
                          toggleBlock(teacher.email)
                        }
                        className={`px-4 py-1 rounded-lg text-white cursor-pointer ${
                          teacher.isBlocked
                            ? "bg-green-600 hover:bg-green-700"
                            : "bg-red-600 hover:bg-red-700"
                        }`}
                      >
                        {teacher.isBlocked ? "Unblock" : "Block"}
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
                    No teachers available
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
