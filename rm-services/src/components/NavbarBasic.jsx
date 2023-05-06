import React from 'react'
import Container from 'react-bootstrap/Container';

import Navbar from 'react-bootstrap/Navbar';

import logo from '../assets/logo.png'
import '../components/component-styles/navbar.css';

function NavbarBasic(){
  return (
    <>
      <Navbar className='custom-nav'>
      <Container className='container'>
        <Navbar.Brand href="/">
          <img className='logo' src={logo} alt="RydMate" />
        </Navbar.Brand>
       
      </Container>
    </Navbar>


    </>
  );
}




export default NavbarBasic
