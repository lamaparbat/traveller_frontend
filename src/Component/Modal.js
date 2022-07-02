import React, { useState, useEffect } from 'react';
import { FiLogOut } from 'react-icons/fi';
import { Button, Modal } from 'react-bootstrap';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import '../App.scss';
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';

const ProfileBtn = () => {
 // bootstrap modal function
 const [show, setShow] = useState(false);
 const handleClose = () => setShow(false);
 const handleShow = () => setShow(true);

 // current form type
 const [form_type, setFormType] = useState("login");

 // cache data
 const [cache, setCache] = useState([]);

 // login data
 const [loginData, setLoginData] = useState({
  email: "",
  password: ""
 });
 
 // signup data
 const [signupData, setSignupData] = useState({
  username:"",
  email: "",
  password: ""
 });

 // validate browser cache
 const cacheValidation = () => {
  try {
   const cache = JSON.parse(localStorage.getItem("traveller"));
   if (cache === null || undefined)
    return setFormType("login");
   return setCache(cache);
  } catch (error) {
   return console.log("Please login to proceed.");
  }
 }

 useEffect(() => {
  cacheValidation()
 }, []);

 //login
 const login = async () => {
  try {
   const res = await axios.post("http://localhost:8000/traveller/login", { email: loginData.email, password: loginData.password });
   const { data, token } = res.data

   // save data to browser cache
   localStorage.setItem("traveller", JSON.stringify({ data, token }));

   //refresh the cache
   window.location.assign("")
  } catch (error) {
   toast.error("Login failed. Please enter correct email or password");
  }
 }

 //signup
 const loadSignupForm = async () => {
  setFormType("signup");
 }

 //logout
 const logout = async () => {
  try {
   const res = await axios.post("http://localhost:8000/traveller/logout", { access_token: cache.token.access_token });

   //clearing cache
   localStorage.clear();

   toast.success("Logout successfully.");

   //refresh the cache
   window.location.assign("")
  } catch (error) {
   toast.error("Failed to logout !!");

   //refresh the cache
   window.location.assign("")
  }
 }

 return (
  <div className='my-2 d-flex flex-row-reverse'>
   <Button variant="primary" className='rounded-circle d-flex justify-content-center align-items-center pb-0' onClick={handleShow}>
    <h2>P</h2>
   </Button>
   {
    form_type !== "signup" ? <Modal show={show} onHide={handleClose}>
     <Modal.Body className='px-4'>
      {
       Object.keys(cache).length > 0 ? <>
        <h2>{cache.data.name}</h2>
        <span>{cache.data.email}</span>
       </> : null
      }
     </Modal.Body>
     {
      Object.keys(cache).length === 0 ?
       <Modal.Body className='px-4'>
        <h2>Sign In</h2>
        <input
         className='email form-control'
         placeholder='Enter email'
         onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
        />
        <input
         className='password form-control mt-2'
         placeholder='Enter password'
         onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
        />
       </Modal.Body> : null
     }
     <Modal.Footer className='px-5'>
      <Button variant="secondary" id='close_btn' onClick={handleClose}>Close</Button>
      {
       Object.keys(cache).length === 0 ?
        <>
         <Button className='px-4' variant="danger" onClick={login}>Login</Button>
         <Button className='px-4 bg-light text-danger' variant="danger" onClick={loadSignupForm}>Create an account ?</Button>
        </> : <Button variant="danger" onClick={logout}><FiLogOut className='me-1' />  Logout</Button>

      }
     </Modal.Footer>
    </Modal> :
     <Modal show={show} onHide={handleClose}>
     <Modal.Body className='px-4'>
       <h2 className='my-2'>Sign up</h2>
       <input
        className='text form-control'
        placeholder='Enter username'
        onChange={(e) => setSignupData({ ...signupData, username: e.target.value })}
       />
      <input
       className='email mt-2 form-control'
       placeholder='Enter email'
        onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
      />
      <input
       className='password form-control mt-2'
       placeholder='Enter password'
        onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
      />
     </Modal.Body>
     <Modal.Footer className='px-5'>
       <Button variant="secondary" id='close_btn' onClick={handleClose}>Close</Button>
       <Button className='px-4' variant="danger" onClick={loadSignupForm}>Submit</Button>
     </Modal.Footer>
    </Modal>
   }
   <ToastContainer />
  </div>
 )
}

export default React.memo(ProfileBtn);