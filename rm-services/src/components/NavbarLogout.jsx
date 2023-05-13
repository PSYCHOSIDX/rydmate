import React , {useEffect}from 'react'
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
import { collection, query, where ,onSnapshot} from "firebase/firestore";
import { db } from '../firebaseConfig';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

function StaticExample() {
  return (
    <div
      className="modal show"
      style={{ display: 'block', position: 'initial' }}
    >
      <Modal.Dialog>
        <Modal.Header closeButton>
          <Modal.Title id='modal-text'>Please Complete Your Profile</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <p id='modal-text'></p>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary">Close</Button>
          <Button variant="primary">Save changes</Button>
        </Modal.Footer>
      </Modal.Dialog>
    </div>
  );
}





function Profile() {
  
 
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [loading, setLoading] = useState(false);
  const {user} = UserAuth();
  const [fireUser, setFireUser]= useState([]);
  
  const colletionRef = collection(db, 'users');
  const userEmail = user.email;
  useEffect(() => {
    const q = query(
      colletionRef,
      where('email', '==', userEmail) 
    );

    setLoading(true);
    // const unsub = onSnapshot(q, (querySnapshot) => {
    const unsub = onSnapshot(q, (querySnapshot) => {
      const items = [];
      querySnapshot.forEach((doc) => {
        items.push(doc.data());
      });
      setFireUser(items);
      setLoading(false);
    });
    return () => {
      unsub();
    };

    // eslint-disable-next-line
  }, []);
 
  return (
    
    <>
         <h5 onClick={handleShow} className='username' ><b>{user && user.email}</b>  </h5>
       {user.photoURL ? <img onClick={handleShow} src={user.photoURL} alt='' className='profile'/> : <FaRegUser onClick={handleShow} className='icon'/>} 
      

      <Offcanvas show={show} onHide={handleClose} id='sidebar'>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title className='user-title'> USER PROFILE </Offcanvas.Title>
        </Offcanvas.Header>
    <br/>
    
        {loading ? <h1>Loading...</h1> : null}
        {fireUser.map((fire) => (
          
        <Offcanvas.Body>
      
       {fire.photoURL ? <img src={user.photoURL} alt='' className='profile'/> : <FaRegUser  className='icon'/>}
          <h4> <b>Name</b> </h4>
          <h5>{fire.displayName}</h5> 
          <br/>
          <h4><b>Email</b></h4>
          <h5>{fire.email}</h5>
         
          {fire.phoneNo ? <p>found</p>: <StaticExample/>}
        </Offcanvas.Body>

    
    
        ))
        }
       
       
        

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
