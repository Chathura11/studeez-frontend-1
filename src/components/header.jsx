import React, { useState } from 'react'
import { FaBars } from 'react-icons/fa'
import { Link, useNavigate } from 'react-router-dom'
import MobileNavPanel from './mobileNavPanel';
import { CiLogout,CiLogin } from "react-icons/ci";
import { CgProfile } from "react-icons/cg";

function header(props) {


  const [navPanelOpen,setNavPanelOpen] = useState(false);
  const token = localStorage.getItem('token');

  const user = props.user;

  const navigate = useNavigate();

  return (
    <header className='w-full h-[70px] shadow-md  flex justify-center items-center relative bg-accent text-white backdrop-blur-md top-0 z-50'>
        <img src="/logo.png" alt="Logo" className="w-16 h-16 object-cover border-4 border-white rounded-full shadow-lg hover:scale-105 transition-transform duration-300 absolute left-1"/>
        <div className='hidden md:flex w-[500px] justify-evenly items-center'>
          {user&&
            user.role == "teacher"?
            <Link to="/teacher" className='hidden md:block text-[22px] m-1 p-2 rounded-full hover:bg-white hover:text-accent'>Dashboard</Link>
            :
            user&&user.role == "student"?
            <Link to="/student" className='hidden md:block text-[22px] m-1 p-2 rounded-full hover:bg-white hover:text-accent'>Dashboard</Link>
            :
            ''
          }
          <Link to="/classes" className='hidden md:block text-[22px]  m-1 p-2 rounded-full hover:bg-white hover:text-accent'>Classes</Link>
          <Link to="/teachers" className='hidden md:block text-[22px]  m-1 p-2 rounded-full hover:bg-white hover:text-accent'>Teachers</Link>
          <Link to="/about-us" className='hidden md:block text-[22px]  m-1 p-2 rounded-full hover:bg-white hover:text-accent'>About us</Link>
        </div>
        <FaBars className='absolute right-5 text-[24px] md:hidden' onClick={()=>setNavPanelOpen(true)}/>
        {token != null ?
          <CiLogout className='hidden md:block absolute right-5 text-[30px] cursor-pointer rounded-full p-1 hover:bg-white hover:text-red-500' onClick={()=>{
            localStorage.removeItem('token')
            window.location.href = '/login'
          }}/>
          :
          <CiLogin className='hidden md:block absolute right-5 text-[30px] cursor-pointer rounded-full p-1 hover:bg-white hover:text-green-500' onClick={()=>{
            window.location.href = '/login'
          }}/>
        }
        {
          token &&
          <CgProfile className='hidden md:block absolute right-15 text-[30px] cursor-pointer rounded-full p-1 hover:bg-white hover:text-accent' onClick={()=>{
            navigate('/user-profile');
          }}/>
        }
        <MobileNavPanel isOpen={navPanelOpen} setOpen={setNavPanelOpen} user={user}/>
    </header>
  )
}

export default header