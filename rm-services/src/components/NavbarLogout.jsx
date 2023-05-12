import React from 'react'
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png'
import '../components/component-styles/navbar.css';
import '../components/component-styles/userprofile.css'
import { UserAuth } from '../context/UserAuthContext';
import { useState } from 'react';
import Offcanvas from 'react-bootstrap/Offcanvas';
import {FaRegUser} from 'react-icons/fa'



function Profile() {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const {user} = UserAuth();
  
  return (
    <>
         <h5 onClick={handleShow} className='username' ><b>{user && user.email}</b>  </h5>
       {user.photoURL ? <img onClick={handleShow} src={user.photoURL} alt='' className='profile'/> : <FaRegUser onClick={handleShow} className='icon'/>} 
      

      <Offcanvas show={show} onHide={handleClose} >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title className='user-title'> USER PROFILE </Offcanvas.Title>
        </Offcanvas.Header>

        <Offcanvas.Body>
          
        </Offcanvas.Body>

      </Offcanvas>
    </>
  );
}

function InfoPage() {
  return (
    <>
      {[' '].map((placement, idx) => (
        <Profile key={idx} placement={placement} name={placement} />
      ))}
    </>
  );
}





function NavbarLogout(){
  const {logout} = UserAuth();
  const navigate = useNavigate();
  const handleLogout = async () => {
    try{
      await logout();
      navigate('/')
    } catch(e) {
      console.log(e.message);
    }
  }

  return (
    <>
      <Navbar className='custom-nav'>
      <Container className='container'>
        <Navbar.Brand href="/">
          <img className='logo' src={logo} alt="RydMate" />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" className='n' />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto nav-hold">
           
            <InfoPage/>

            <Link to="" className='link'>
            <button onClick={handleLogout} className='btn-contact'> Logout </button>
            </Link>
            
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>


    </>
  );
}




export default NavbarLogout;
