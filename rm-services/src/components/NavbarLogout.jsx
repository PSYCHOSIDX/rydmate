
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
// eslint-disable-next-line
import { collection, query, where ,onSnapshot, doc, updateDoc, collectionGroup, } from "firebase/firestore";
import { db } from '../firebaseConfig';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';

function StaticExample() {
  const {user} = UserAuth();
  
  const [phoneNoPara, setPhoneNo]= useState("");
  const [Age, setAge] = useState("");
  const [sex, setSex]= useState("");
  const userId = user.uid;

  const handleUpdate = async (e) => {
    e.preventDefault()
    const DocRef = doc(db, 'users', userId)
    try{
      await updateDoc(DocRef, {
        age: Age,
        phoneNo: phoneNoPara,
        gender:sex
      })
      alert('Your profile is ready')
    } catch (err) {
      alert(err)
    }    
  }



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
        <Form xs="auto" className="sign-form" onSubmit={handleUpdate}>
          <Form.Group className="mb-3 none" controlId="formBasicEmail">
                <Form.Label>Age</Form.Label>
                <Form.Control onChange={(e) => setAge(e.target.value)} type="number" placeholder="Enter Age" required/>
              </Form.Group>
              <Form.Group className="mb-3 none" controlId="formBasicPassword">
                <Form.Label>Phone Number</Form.Label>
                <Form.Control onChange={(e) => setPhoneNo(e.target.value)} type="tel" name="phoneNumber" id="phoneNumber"  pattern="[0-9]{10}" placeholder="Enter Phone Number " required />
              </Form.Group>
              <Form.Group className="mb-3 none" controlId="formBasicEmail">
                <Form.Label>Gender</Form.Label>
                <Form.Control onChange={(e) => setSex(e.target.value)} type="text" placeholder="Enter Gender" required/>
              </Form.Group>

              <Button variant="primary" type='submit'>Save changes</Button>

    </Form>
        </Modal.Body>


      </Modal.Dialog>
    </div>
  );
}


// This is profile finction this contains all sidebar data


function Profile() {
  
 
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const {user} = UserAuth();
  const [fireUser, setFireUser]= useState([]);
  
  
  useEffect(() => {
    const userEmail = user.email;
    const q = query(collection(db, 'users'), where('email', '==', userEmail))
    onSnapshot(q, (querySnapshot) => {
      setFireUser(querySnapshot.docs.map(doc => ({
        id: doc.id,
        data: doc.data()
      })))
    })
    
  },[])



  // useEffect(() => {
  //   const colletionRef = collection(db, 'users');
  //   const userEmail = user.email;
    
  //   const q = query(colletionRef,where('email', '==', true && userEmail) );

  //   setLoading(true);
    
  //   const unsub = onSnapshot(q, (querySnapshot) => {
  //     const items = [];
  //     querySnapshot.forEach((doc) => {
  //       items.push(doc.data());
  //     });
  //     setFireUser(items);
  //     setLoading(false);
  //   });
  //   return () => {
  //     unsub();
  //   };

  //   // eslint-disable-next-line
  // }, []);
 
  return (
    
    <>
         <h5 onClick={handleShow} className='username' ><b>{user && user.email}</b>  </h5>
       {user.photoURL ? <img onClick={handleShow} src={user.photoURL} alt='' className='profile'/> : <FaRegUser onClick={handleShow} className='icon'/>} 
      

      <Offcanvas show={show} onHide={handleClose} id='sidebar'>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title className='user-title'> USER PROFILE </Offcanvas.Title>
        </Offcanvas.Header>
    <br/>
    
        {fireUser.map((fire) => (
          
        <Offcanvas.Body>
      
       {fire.data.photoURL ? <img src={user.photoURL} alt='' className='profile'/> : <FaRegUser  className='icon'/>}
          <h4> <b>Name</b> </h4>
          <h5>{fire.data.displayName}</h5> 
          <br/>
          <h4><b>Email</b></h4>
          <h5>{fire.data.email}</h5>
     
          {fire.data.phoneNo ? 
          <div>
          <h4> <b>Phone Number</b> </h4>
          <h5>{fire.data.phoneNo}</h5> 
          <br/>
          <h4><b>Age</b></h4>
          <h5>{fire.data.age}</h5>
          <br/>
          <h4><b>Gender</b></h4>
          <h5>{fire.data.gender}</h5>
          </div>
          
          : <StaticExample/>}
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
