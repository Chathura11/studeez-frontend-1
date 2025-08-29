import { IoMdClose } from "react-icons/io";
import { useEffect, useState } from "react";
import { FaUser } from "react-icons/fa6";
import { IoPricetags } from "react-icons/io5";
import { BsBuildingFill } from "react-icons/bs";
import { FaUserTie } from "react-icons/fa6";
import { MdDashboard } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { CiLogout,CiLogin } from "react-icons/ci";

export default function MobileNavPanel(props) {
    const isOpen = props.isOpen;
    const setOpen = props.setOpen;
    const user = props.user;

    const [visible, setVisible] = useState(false);
    const [animate, setAnimate] = useState(false);

    const token = localStorage.getItem('token');

    const navigate = useNavigate();

    function Goto(route) {
        navigate(route);
        setOpen(false);
    }

    useEffect(() => {
        if (isOpen) {
            setVisible(true);
            setTimeout(() => setAnimate(true), 10);  // Start slide-in
        } else {
            setAnimate(false);  // Start slide-out
            setTimeout(() => setVisible(false), 300);  // Wait for animation to finish
        }
    }, [isOpen]);

    return (
        <>
            {visible && (
                <div className={`fixed top-0 left-0 w-full h-screen z-50 flex 
                    ${animate ? 'bg-[#00000075]' : 'bg-transparent'} 
                    transition-colors duration-300 ease-in-out`}>
                    <div
                        className={`h-full bg-white w-[300px] transform 
                        ${animate ? 'translate-x-0' : '-translate-x-full'}
                        transition-transform duration-300 ease-in-out shadow-lg`}
                    >
                        <div className="bg-accent w-full h-[70px] flex justify-center items-center relative">
                            <img src="/logo.jpg" alt='logo' className='w-[60px] h-[60px] object-cover border-[1px] absolute left-1 rounded-full ' />
                            <IoMdClose
                                className="absolute right-3 text-3xl cursor-pointer hover:text-red-500 transition-colors"
                                onClick={() => setOpen(false)}
                            />
                        </div>

                        <div className="p-3 space-y-2">
                            {user&&
                                user.role == "teacher"?
                                <div onClick={() => Goto('/teacher')} className='flex items-center gap-3 text-[18px] text-gray-700 hover:bg-accent hover:text-white p-2 rounded-lg cursor-pointer transition'>
                                    <MdDashboard className="text-2xl" /> Dashboard
                                </div>
                                :
                                user&&user.role == "student"?
                                <div onClick={() => Goto('/student')} className='flex items-center gap-3 text-[18px] text-gray-700 hover:bg-accent hover:text-white p-2 rounded-lg cursor-pointer transition'>
                                    <MdDashboard className="text-2xl" /> Dashboard
                                </div>
                                :
                                ''
                            }
                            
                            <div onClick={() => Goto('/classes')} className='flex items-center gap-3 text-[18px] text-gray-700 hover:bg-accent hover:text-white p-2 rounded-lg cursor-pointer transition'>
                                <BsBuildingFill className="text-2xl" /> Classes
                            </div>
                            <div onClick={() => Goto('/teachers')} className='flex items-center gap-3 text-[18px] text-gray-700 hover:bg-accent hover:text-white p-2 rounded-lg cursor-pointer transition'>
                                <FaUserTie className="text-2xl" /> Teachers
                            </div>
                            <div onClick={() => Goto('/about-us')} className='flex items-center gap-3 text-[18px] text-gray-700 hover:bg-accent hover:text-white p-2 rounded-lg cursor-pointer transition'>
                                <IoPricetags className="text-2xl" /> About Us
                            </div>
                            
                            {
                                token &&
                                <div onClick={() => Goto('/user-profile')} className='flex items-center gap-3 text-[18px] text-gray-700 hover:bg-accent hover:text-white p-2 rounded-lg cursor-pointer transition'>
                                    <FaUser  className="text-2xl" /> Profile
                                </div>

                            }
                            {token !=null ?
                                <div onClick={() => {
                                    localStorage.removeItem('token')
                                    Goto('/login')
                                }} className='flex items-center gap-3 text-[18px] text-gray-700 hover:bg-accent hover:text-white p-2 rounded-lg cursor-pointer transition'>
                                    <CiLogout className="text-2xl" /> Log Out
                                </div>
                                :
                                <div onClick={() => Goto('/login')} className='flex items-center gap-3 text-[18px] text-gray-700 hover:bg-accent hover:text-white p-2 rounded-lg cursor-pointer transition'>
                                    <CiLogin className="text-2xl" /> Log In
                                </div>
                            }
                        </div>

                    </div>
                </div>
            )}
        </>
    );
}
