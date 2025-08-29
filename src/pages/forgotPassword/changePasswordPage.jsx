import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios'
import toast from "react-hot-toast";

export default function ChangePasswordPage(){

    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');
    const [newPassword,setNewPassword] = useState('');
    const navigate = useNavigate();

    function handleSubmit(){

        const data ={
            email : email,
            password : password,
            newPassword :newPassword
        }

        axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/user/changePassword/${email}`,data).then((res)=>{
            toast.success('Password changed successfully!');
            navigate('/login')
        }).catch((error)=>{
            toast.error(error.response.data.message);
        })
    }

    return(
        <div className="w-full h-screen flex justify-center items-center">
            <div className="w-[400px] bg-white shadow-2xl rounded-2xl flex flex-col items-center p-8 space-y-2">
                <h1 className="font-bold text-2xl"> Change Password</h1>
                <p className="text-gray-500">Please change your temporary password</p>
                <input  placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} className="border p-2 rounde-lg w-[80%]"/>
                <input type="password" placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)} className="border p-2 rounde-lg w-[80%]"/>
                <input type="password" placeholder="New Password" value={newPassword} onChange={(e)=>setNewPassword(e.target.value)} className="border p-2 rounde-lg w-[80%]"/>
                <button onClick={handleSubmit} className="bg-blue-500 text-white p-2 rounded-lg w-[80%] hover:bg-blue-600 cursor-pointer">Submit</button>
                <Link to="/login"  className="bg-blue-500 text-white p-2 rounded-lg w-[80%] hover:bg-blue-600 cursor-pointer align-middle text-center">Back</Link>
            </div>
        </div>
    )
}