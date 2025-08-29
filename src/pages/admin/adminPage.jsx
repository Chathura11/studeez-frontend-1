import { BsGraphDown } from "react-icons/bs";
import { FaClipboardList,FaUsers ,FaWindowMaximize,FaChalkboardTeacher,FaRegBuilding   } from "react-icons/fa";
import { Link, Route, Routes } from "react-router-dom";
import AdminUsersPage from "./adminUsersPage";
import { useEffect, useState } from "react";
import axios from "axios";
import AdminDashboard from "./adminDashboard";
import { TbLogout2 } from "react-icons/tb";
import AdminSubjectsPage from "./adminSubjectsPage";
import AdminTeachersPage from "./adminTeachersPage";
import AdminClassesPage from "./adminClassesPage";

export default function AdminPage() {
  const [userValidated, setUserValidated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      window.location.href = '/login';
      return;
    }

    axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/user/profile`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => {
      const user = res.data;
      if (user.role === "admin") {
        setUserValidated(true);
      } else {
        window.location.href = '/';
      }
    }).catch(error => {
      console.error(error);
      setUserValidated(false);
    });
  }, []);

  return (
    <div className="w-full h-screen flex bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 h-full bg-[#037c6e] text-white flex flex-col shadow-lg">
        <Link to="/admin" className="flex items-center gap-3 p-4 text-lg hover:bg-[#025043] transition">
          <BsGraphDown className="text-2xl" />
          Dashboard
        </Link>
        <Link to="/admin/subjects" className="flex items-center gap-3 p-4 text-lg hover:bg-[#025043] transition">
          <FaClipboardList className="text-2xl" />
          Subjects
        </Link>
        <Link to="/admin/teachers" className="flex items-center gap-3 p-4 text-lg hover:bg-[#025043] transition">
          <FaChalkboardTeacher className="text-2xl" />
          Teachers
        </Link>
        <Link to="/admin/classes" className="flex items-center gap-3 p-4 text-lg hover:bg-[#025043] transition">
          <FaRegBuilding  className="text-2xl" />
          Classes
        </Link>
        <Link to="/admin/users" className="flex items-center gap-3 p-4 text-lg hover:bg-[#025043] transition">
          <FaUsers className="text-2xl" />
          Users
        </Link>
        <Link to="/" className="flex items-center gap-3 p-4 text-lg hover:bg-[#025043] transition">
          <FaWindowMaximize className="text-2xl" />
          Go to Site
        </Link>
        <div className="flex items-center gap-3 p-4 text-lg hover:bg-[#025043] transition cursor-pointer" onClick={()=>{
          localStorage.removeItem('token')
          window.location.href = '/login'
        }}>
          <TbLogout2 className="text-2xl" />
          Log Out
        </div>
      </aside>

      {/* Content Area */}
      <main className="flex-1 p-6 overflow-y-auto">
        {userValidated ? (
          <Routes>
            <Route path="/" element={<AdminDashboard />} />
            <Route path="/subjects" element={<AdminSubjectsPage />} />
            <Route path="/teachers" element={<AdminTeachersPage />} />
            <Route path="/classes" element={<AdminClassesPage />} />
            <Route path="/users" element={<AdminUsersPage />} />
          </Routes>
        ) : (
          <div className="flex justify-center items-center h-full text-gray-500">
            Validating admin access...
          </div>
        )}
      </main>
    </div>
  );
}
