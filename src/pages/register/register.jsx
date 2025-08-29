import { useState } from "react";
import "./register.css";
import axios from 'axios';
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function Register() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        grade: "",
        contactNo:""
    });

    const navigate = useNavigate();
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    function handleOnChange(e) {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    function handleOnSubmit(e) {
        e.preventDefault();
        axios.post(backendUrl + '/api/user/register', formData)
            .then((res) => {
                toast.success('Registration successful');
                navigate('/login');
            })
            .catch((error) => {
                toast.error(error?.response?.data?.message || 'Registration failed');
            });
    }

    return (
        <div className="bg-picture w-full h-screen flex justify-center items-center relative">
            <form onSubmit={handleOnSubmit} className="relative z-10">
                <div className="w-[600px] h-auto p-8 bg-white/30 backdrop-blur-2xl border border-white/20 rounded-3xl shadow-2xl flex flex-col justify-center items-center space-y-6">

                    <img
                        src="/logo.jpg"
                        alt="Logo"
                        className="w-24 h-24 object-cover border-4 border-white rounded-full shadow-lg hover:scale-105 transition-transform duration-300"
                    />

                    <input 
                        name="name" 
                        onChange={handleOnChange} 
                        value={formData.name} 
                        type="text" 
                        placeholder="Name" 
                        className="w-[300px] py-2 bg-transparent border-b-2 border-gray-500 text-gray-800 text-lg placeholder-gray-500 outline-none focus:border-accent transition-all"
                        required 
                    />

                    <input 
                        name="email" 
                        onChange={handleOnChange} 
                        value={formData.email} 
                        type="email" 
                        placeholder="Email" 
                        className="w-[300px] py-2 bg-transparent border-b-2 border-gray-500 text-gray-800 text-lg placeholder-gray-500 outline-none focus:border-accent transition-all"
                        required 
                    />

                    <input 
                        name="password" 
                        onChange={handleOnChange} 
                        value={formData.password} 
                        type="password" 
                        placeholder="Password" 
                        className="w-[300px] py-2 bg-transparent border-b-2 border-gray-500 text-gray-800 text-lg placeholder-gray-500 outline-none focus:border-accent transition-all"
                        required 
                    />

                    <input 
                        name="grade" 
                        onChange={handleOnChange} 
                        value={formData.grade} 
                        type="text" 
                        placeholder="Grade" 
                        className="w-[300px] py-2 bg-transparent border-b-2 border-gray-500 text-gray-800 text-lg placeholder-gray-500 outline-none focus:border-accent transition-all" 
                    />

                    <input 
                        name="contactNo" 
                        onChange={handleOnChange} 
                        value={formData.contactNo} 
                        type="text" 
                        placeholder="Contact No" 
                        className="w-[300px] py-2 bg-transparent border-b-2 border-gray-500 text-gray-800 text-lg placeholder-gray-500 outline-none focus:border-accent transition-all" 
                    />  

                    <button 
                        type="submit"
                        className="w-[300px] py-3 bg-gradient-to-r from-yellow-500 to-amber-600 text-white text-lg rounded-xl shadow-md hover:from-amber-600 hover:to-yellow-500 transition-all cursor-pointer"
                    >
                        Register
                    </button>
                </div>
            </form>
        </div>
    );
}
