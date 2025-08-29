import { useState } from "react"
import axios from 'axios';
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import Spinner from "../../components/spinner.jsx";

export default function ForgotPasswordPage(){

    const [email,setEmail] = useState("");
    const [otp,setOtp] = useState("");
    const [isSent,setIsSent] = useState(false);
    const [sending,setSending] = useState(false);
    const [verfing,setVerifing] = useState(false);
    const navigate = useNavigate();

    async function handleSendOTP(){
        if(email !=""){
            setSending(true);
            await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/user/forgotPassword/sendOTP/${email}`).then((res)=>{
                toast.success("Code sent successfully!")
                setIsSent(true);
                setSending(false);
            }).catch((error)=>{
                toast.error(error.response.data.message)
                setSending(false);
            })
        }
    }

    async function handleVerify(){
        if(email != ""){
            setVerifing(true);
            await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/user/forgotPassword/verifyEmail/${email}`,
                {
                    code:parseInt(otp)
                }
        
            ).then((res)=>{
                console.log(res.data);
                toast.success("Email verified successfully!");
                sendEmail();

            }).catch((error)=>{
                console.log(error);
                toast.error("Invalid OTP");
                setVerifing(false);
            })
        }
        
    }

    async function sendEmail(){
        if(email != ""){
            await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/user/forgotPassword/${email}`).then((res)=>{
                setVerifing(false);
                toast.success('Email sent successfully!');
                navigate('/change-password')
            }).catch((error)=>{
                toast.error(error.response.data.message);
                setVerifing(false);
            })
        }
    }

    return(
        <div className="w-full h-screen flex justify-center items-center">
            <div className="w-[400px] bg-white shadow-2xl rounded-2xl flex flex-col items-center p-8 space-y-2">
                <h1 className="font-bold text-2xl"> Forgot Password</h1>
                <p className="text-gray-500">Please enter your email</p>
                <input  placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} className="border p-2 rounde-lg w-[80%]"/>
                <button onClick={handleSendOTP} className="bg-blue-500 text-white p-2 rounded-lg w-[80%] hover:bg-blue-600 cursor-pointer">
                    {sending ? <Spinner /> : "Send Code"}
                </button>
                {
                    isSent&&
                    <>
                        <input  placeholder="Code" value={otp} onChange={(e)=>setOtp(e.target.value)} className="border p-2 rounde-lg w-[80%]"/>
                        <button onClick={handleVerify} className="bg-blue-500 text-white p-2 rounded-lg w-[80%] hover:bg-blue-600 cursor-pointer">
                            {verfing ? <Spinner /> : "Verify"}
                        </button>
                    </>
                }
                <Link to="/login"  className="bg-blue-500 text-white p-2 rounded-lg w-[80%] hover:bg-blue-600 cursor-pointer align-middle text-center">Back</Link>
            </div>
        </div>
    )
}