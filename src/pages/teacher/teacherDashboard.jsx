import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FaUsers ,FaBell} from "react-icons/fa";
import { FaBookOpen } from "react-icons/fa6";

export default function TeacherDashboard(props) {
  const [stats, setStats] = useState({ classes: 0, students: 0, pending: 0 });
  const [myClasses, setMyClasses] = useState([]);
  const token = localStorage.getItem("token");

  const user= props.user; 

  const hour = new Date().getHours();
  let greeting = "Hello";
  if (hour < 12) {
      greeting = "Good Morning";
  } else if (hour < 18) {
      greeting = "Good Afternoon";
  } else {
      greeting = "Good Evening";
  }  


  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/api/teacher/classes`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setMyClasses(res.data || []);
        const totalStudents = res.data.reduce((acc, c) => acc + (c.students?.length || 0), 0);
        const pending = res.data.reduce((acc, c) => acc + (c.studentRequests?.length || 0), 0);
        setStats({ classes: res.data.length, students: totalStudents, pending });
      })
      .catch(() => {});
  }, []);

  const cards = [
    {
      label: "My Classes",
      value: stats.classes,
      icon: <FaBookOpen className="w-8 h-8 text-teal-600" />,
      color: "from-teal-100 to-teal-200",
    },
    {
      label: "Total Students",
      value: stats.students,
      icon: <FaUsers className="w-8 h-8 text-blue-600" />,
      color: "from-blue-100 to-blue-200",
    },
    {
      label: "Pending Requests",
      value: stats.pending,
      icon: <FaBell className="w-8 h-8 text-orange-600" />,
      color: "from-orange-100 to-orange-200",
    },
  ];

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
      <div className="bg-gradient-to-r from-teal-600 via-teal-700 to-teal-800 p-6 rounded-b-2xl shadow-lg mb-4">
        <h1 className="text-2xl md:text-3xl font-extrabold text-white mb-2 flex items-center gap-2">
          👩‍💼 Teacher Dashboard
        </h1>
        <p className="text-lg text-teal-100">
          {greeting}, <span className="font-semibold">{user?user.name:'...'}</span> 👋
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {cards.map((card, i) => (
          <div
            key={i}
            className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 flex items-center gap-4"
          >
            <div
              className={`p-4 rounded-xl bg-gradient-to-br ${card.color}`}
            >
              {card.icon}
            </div>
            <div>
              <p className="text-gray-500 text-sm">{card.label}</p>
              <p className="text-3xl font-bold text-gray-800">{card.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-3">My Classes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {myClasses.map((cls) => (
            <Link
              key={cls._id}
              to={`/teacher/classes/${cls._id}`}
              className="bg-white rounded-xl shadow hover:shadow-md transition p-4"
            >
              <img
                src={cls.imageUrl}
                alt={cls.name}
                className="w-full h-40 object-cover rounded-lg mb-3"
              />
              <p className="text-sm text-gray-500">{cls.subject?.name}</p>
              <h3 className="text-lg font-bold">{cls.name}</h3>
              <p className="text-sm text-gray-600">Grade: {cls.grade}</p>
              <p className="text-sm text-gray-600">Students count: {cls.students?.length}</p>
              <p className={`text-sm ${cls.studentRequests?.length>0?"text-green-600":"text-gray-600"}`}>Pending Requests: {cls.studentRequests?.length}</p>
            </Link>
          ))}
        </div>
      </div>
      </div>
    </div>
  );
}
