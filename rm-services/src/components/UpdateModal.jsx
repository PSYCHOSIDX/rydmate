import React, { useState  } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { UserAuth } from '../context/UserAuthContext';
import { updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import Form from 'react-bootstrap/Form';
import '../components/component-styles/userprofile.css'

function Example() {
    
  
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const {user} = UserAuth();
  
  // const [displayName, setDisplayName]= useState("");
  // const [email, setEmail]= useState("");
  const [phoneNumberData, setPhoneNumber]= useState("");
  
  const userId = user.uid;

  const handleUpdate = async (e) => {
    e.preventDefault()
    const DocRef = doc(db,'users', userId)
    try{
      await updateDoc(DocRef, {
        phoneNumber: phoneNumberData,
      
      })

      alert('Your profile is ready')
    } catch (err) {
      alert(err)
    }   
    
  }
  return (
    <>
      <Button id='update-button' onClick={handleShow}>
        Update
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Update Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Form xs="auto" className="sign-form" onSubmit={handleUpdate}>
        
     
        <Form.Group className="mb-3 none" controlId="formBasicPassword">
          <Form.Label>Phone Number</Form.Label>
          <Form.Control onChange={(e) => setPhoneNumber(e.target.value)} type="tel" name="phoneNumber" id="phoneNumber"  pattern="[0-9]{10}" placeholder="Enter Phone Number " required />
        </Form.Group>
      

        <Button variant="success" type='submit'>Save changes</Button>
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

export default Example