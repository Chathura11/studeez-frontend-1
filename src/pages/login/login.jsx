import { useState } from "react";
import "./login.css";
import axios from 'axios';
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import { FaGoogle } from "react-icons/fa";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const googleLogin = useGoogleLogin({
        onSuccess: (res) => {
            axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/users/google`, {
                accessToken: res.access_token
            }).then((res) => {
                toast.success('Login success');
                const user = res.data.user;
                localStorage.setItem("token", res.data.token);
                user.role === "admin" ? navigate('/admin/') : navigate('/');
            }).catch((error) => {
                console.log(error);
            });
        }
    });

    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    function handleOnSubmit(e) {
        e.preventDefault();
        axios.post(backendUrl + '/api/user/login', {
            email: email,
            password: password
        }).then((res) => {
            toast.success('Login success');
            const user = res.data.user;
            localStorage.setItem("token", res.data.token);
            if (!user.emailVerified) {
                navigate('/verify-email');
                return;
            }
            user.role === "admin" ? navigate('/admin/') : user.role === "teacher" ? navigate('/teacher') : navigate('/student');
        }).catch((error) => {
            toast.error(error.response.data.message);
        });
    }

    return (
        <div className="bg-picture w-full h-screen flex justify-center items-center relative">
            <form onSubmit={handleOnSubmit} className="relative z-10">
                <div className="w-[600px] h-auto p-8 bg-white/30 backdrop-blur-2xl border border-white/20 rounded-3xl shadow-2xl flex flex-col justify-center items-center space-y-6">

                    <img
                        src="/logo.png"
                        alt="Logo"
                        className="w-24 h-24 object-cover border-4 border-white rounded-full shadow-lg hover:scale-105 transition-transform duration-300"
                    />

                    <input
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                        type="email"
                        placeholder="Email"
                        className="w-[300px] py-2 bg-transparent border-b-2 border-gray-500 text-gray-800 text-lg placeholder-gray-500 outline-none focus:border-accent transition-all"
                    />

                    <input
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                        type="password"
                        placeholder="Password"
                        className="w-[300px] py-2 bg-transparent border-b-2 border-gray-500 text-gray-800 text-lg placeholder-gray-500 outline-none focus:border-accent transition-all"
                    />

                    <button
                        type="submit"
                        className="w-[300px] py-3 bg-gradient-to-r from-yellow-500 to-amber-600 text-white text-lg rounded-xl shadow-md hover:from-amber-600 hover:to-yellow-500 transition-all cursor-pointer"
                    >
                        Login
                    </button>

                    <div className="text-accent border-b mt-[-15px]">
                        <Link to="/forgot-password">Forgot Password</Link>
                    </div>

                    {/* <div
                        onClick={googleLogin}
                        className="w-[300px] py-3 bg-blue-600 text-white text-lg rounded-xl shadow-md flex justify-center items-center gap-3 cursor-pointer hover:bg-blue-800 transition-all"
                    >
                        <FaGoogle size={20} />
                        Login with Google
                    </div> */}

                    <div
                        onClick={() => navigate('/register')}
                        className="w-[300px] py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-lg rounded-xl shadow-md flex justify-center items-center cursor-pointer hover:from-emerald-600 hover:to-green-500 transition-all"
                    >
                        Don't have an account? Register
                    </div>

                </div>
            </form>
        </div>
    );
}
