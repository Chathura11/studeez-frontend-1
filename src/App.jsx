import './App.css'
import {BrowserRouter, Route, Routes} from 'react-router-dom'
import { GoogleOAuthProvider } from '@react-oauth/google';

import AdminPage from './pages/admin/adminPage';
import HomePage from './pages/home/homePage'
import Login from './pages/login/login';
import { Toaster } from 'react-hot-toast';
import RegisterPage from './pages/register/register';
import VerifyEmail from './pages/verifyEmail/verifyEmail';
import ForgotPasswordPage from './pages/forgotPassword/forgotPasswordPage';
import ChangePasswordPage from './pages/forgotPassword/changePasswordPage';


function App() {

  return (
    <GoogleOAuthProvider clientId='240939730538-hfvtfa08468377lhi7ao3lcg2p8qubd6.apps.googleusercontent.com'>
      <BrowserRouter>
        <Toaster/>
        <Routes path="/*">
          <Route path='/login' element={<Login/>}></Route>
          <Route path='/Register' element={<RegisterPage/>}></Route>
          <Route path='/verify-email' element={<VerifyEmail/>}></Route>
          <Route path='/forgot-password' element={<ForgotPasswordPage/>}></Route>
          <Route path='/change-password' element={<ChangePasswordPage/>}></Route>
          <Route path='/admin/*' element={<AdminPage/>}/>
          <Route path='/*' element={<HomePage/>} />
        </Routes> 
      </BrowserRouter>
    </GoogleOAuthProvider>
  )
}

export default App
