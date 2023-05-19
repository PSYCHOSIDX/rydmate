import React, { useState  } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { UserAuth } from '../context/UserAuthContext';
import { updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import Form from 'react-bootstrap/Form';
import '../components/component-styles/emergency.css'

function EContacts() {
    
  
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const {user} = UserAuth();
  

  const [phoneNo, setPhoneNo]= useState("");
  const [name, setName]= useState("");

  const userId = user.uid;

  const handleUpdate = async (e) => {
    e.preventDefault()
    const DocRef = doc(db,'users', userId)
    try{
      await updateDoc(DocRef, {
        emergencyPhoneNo: phoneNo,
        emergencyName: name,
      
      })

      alert('Your profile is ready')
    } catch (err) {
      alert(err)
    }   
    
  }
  return (
    <>
      <Button id='btn-add' onClick={handleShow}>
        Add Contact
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Create Emergency Contact</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Form xs="auto" className="sign-form" onSubmit={handleUpdate}>
        
        <Form.Group className="mb-3 none" controlId="formBasicPassword">
          <Form.Label>Name</Form.Label>
          <Form.Control onChange={(e) => setName(e.target.value)} type="text" id="phoneNumber"   placeholder="Enter Name " required />
        </Form.Group>
      
     
        <Form.Group className="mb-3 none" controlId="formBasicPassword">
          <Form.Label>Phone Number</Form.Label>
          <Form.Control onChange={(e) => setPhoneNo(e.target.value)} type="tel" name="phoneNumber" id="phoneNumber"  pattern="[0-9]{10}" placeholder="Enter Phone Number " required />
        </Form.Group>
      

        <Button variant="success" type='submit'>Add Contact</Button>
        
    </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
         
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default EContacts