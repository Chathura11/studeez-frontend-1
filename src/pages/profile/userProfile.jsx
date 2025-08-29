import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function UserProfile() {

    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        LoadUser();
    }, []);

    async function LoadUser() {
        const token = localStorage.getItem('token');
        try {
            const result = await axios.get(import.meta.env.VITE_BACKEND_URL + '/api/user/profile', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUser(result.data);
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="w-full h-full flex flex-wrap pt-[50px] justify-center">
            {!user ? (
                <div className="text-lg text-gray-600 animate-pulse">Loading Profile...</div>
            ) : (
                <div className="bg-white shadow-2xl md:max-h-[350px] rounded-3xl p-8 max-w-4xl w-full flex flex-col md:flex-row items-center md:items-start gap-10">
                    
                    <div className="flex flex-col items-center">
                        <img 
                            src={user.profilePicture} 
                            alt="Profile" 
                            className="w-44 h-44 rounded-full border-4 border-accent object-cover shadow-md"
                        />
                        <h2 className="text-3xl font-bold text-gray-800 mt-4">
                            {user.firstname} {user.lastname}
                        </h2>
                        <p className="text-accent text-base mt-1 capitalize">
                            {user.role}
                        </p>
                    </div>

                    <div className="flex-1 w-full">
                        <h3 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">Account Details</h3>

                        <div className="space-y-4 text-sm">
                            <div className="flex justify-between">
                                <span className="font-medium text-gray-600">Email:</span>
                                <span className="text-gray-800 text-right break-all">{user.email}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-medium text-gray-600">Email Verified:</span>
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                    user.emailVerified ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                                }`}>
                                    {user.emailVerified ? "Verified" : "Not Verified"}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-medium text-gray-600">Grade:</span>
                                <span className="text-gray-800">{user.grade}</span>
                            </div>
                        </div>

                        <div className="mt-6 flex flex-col sm:flex-row gap-4">

                            <button 
                                onClick={() => navigate('/user-edit')}
                                className="bg-accent text-white px-6 py-2 rounded-full hover:bg-blue-900 transition shadow-md cursor-pointer"
                            >
                                Edit Profile
                            </button>        

                            {user.role === "customer" && (
                                <button 
                                    onClick={() => navigate('/user-orders')}
                                    className="bg-accent text-white px-6 py-2 rounded-full hover:bg-blue-900 transition shadow-md cursor-pointer"
                                >
                                    My Orders
                                </button>
                            )}
                            {user.role === "admin" && (
                                <button 
                                    onClick={() => window.location.href = '/admin'}
                                    className="bg-accent text-white px-6 py-2 rounded-full hover:bg-blue-900 transition shadow-md cursor-pointer"
                                >
                                    Admin Panel
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
