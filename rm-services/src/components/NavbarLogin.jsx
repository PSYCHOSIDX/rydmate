import React from 'react'
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png'
import '../components/component-styles/navbar.css';

function NavbarLogin(){
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
            {/* <Nav.Link href="#home" className='nav-link link'>Home</Nav.Link>
            <Nav.Link href="#services" className='nav-link link'>Services</Nav.Link>
            <Nav.Link href="#about" className=' nav-link link'>About Us</Nav.Link> */}
            <Link to="/login" className='link'>
            <button  className='btn-contact' id='visible'> Login </button>
            </Link>
            
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>


    </>
  );
}




export default NavbarLogin;
