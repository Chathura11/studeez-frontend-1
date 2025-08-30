import React, { useEffect, useState } from 'react'
import Header from '../../components/header'
import { Navigate, Route, Routes } from 'react-router-dom'
import Home from './home';
import Error from './error'
import UserProfile from '../profile/userProfile';
import UserEdit from '../profile/userEdit';
import TeacherDashboard from '../teacher/teacherDashboard';
import TeacherClasses from '../teacher/teacherClasses';
import TeacherClassDetail from '../teacher/teacherClassDetail';
import StudentDashboard from '../student/studentDashboard';
import StudentClassPage from '../student/studentClassPage';
import StudentMaterialsPage from '../student/studentMaterialsPage';
import StudentAnnouncementsPage from '../student/studentAnnouncementsPage';
import StudentAssignmentsPage from '../student/studentAssignmentsPage';
import StudentAssignmentSubmitPage from '../student/studentAssignmentsSubmitPage';
import StudentZoomLinksPage from '../student/studentZoomLinksPage';
import axios from 'axios';
import TeachersPage from './teachersPage';
import AboutUs from './aboutUsPage';

function homePage() {

  const [user, setUser] = useState(null);
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
    <>
        <Header user={user}/>
        <div className='h-[calc(100vh-100px)] bg-primary'>
            <Routes path="/*">
                {/* Redirect from / to /classes */}
                <Route path="/" element={<Navigate to="/classes" replace />} />

                <Route path="/teacher" element={<TeacherDashboard user={user}/>} />
                <Route path="/teacher/classes" element={<TeacherClasses />} />
                <Route path="/teacher/classes/:id" element={<TeacherClassDetail />} />

                <Route path="/student" element={<StudentDashboard user={user}/>} />
                <Route path="/student/class/:id" element={<StudentClassPage />} />
                <Route path="/student/class/:id/materials" element={<StudentMaterialsPage />} />
                <Route path="/student/class/:id/announcements" element={<StudentAnnouncementsPage />} />
                <Route path="/student/class/:id/assignments" element={<StudentAssignmentsPage />} />
                <Route path="/student/class/:id/zoomlinks" element={<StudentZoomLinksPage />} />
                <Route path="/student/assignments/:assignmentId/submit" element={<StudentAssignmentSubmitPage />} />

                <Route path='/teachers' element={<TeachersPage/>}/>
                <Route path='/about-us' element={<AboutUs/>}/>
                <Route path='/user-profile' element={<UserProfile/>}></Route>
                <Route path='/user-edit' element={<UserEdit/>}></Route>
                <Route path='/classes' element={<Home/>}/>
                <Route path='/*' element={<Error/>}/>
            </Routes>
        </div>
    </>
  )
}

export default homePage
