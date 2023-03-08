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
       <Navbar bg="dark" variant="dark" className='nav-bg'>
        <Container>
          <Navbar.Brand href="/">
              <img src={logo} alt="RydMate" />
          </Navbar.Brand>


          <Nav className="me-auto">
            <Nav.Link href="#home">
             <Link to="" className='link'>
             <button className='login-btn'> Login</button>
             </Link>
            </Nav.Link>
            
          </Nav>
        </Container>
      </Navbar>


    </>
  );
}




export default NavbarLogin;
