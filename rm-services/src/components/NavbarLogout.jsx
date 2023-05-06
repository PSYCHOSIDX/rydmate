import React from 'react'
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png'
import '../components/component-styles/navbar.css';
import { UserAuth } from '../context/UserAuthContext';

function NavbarLogout(){
  const {logout, user} = UserAuth();
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
            <h5 className='username'><b>{user && user.email}</b>  </h5>
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
