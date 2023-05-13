import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

function Example() {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const {user} = UserAuth();
  
  const [displayName, setDisplayName]= useState("");
  const [email, setEmail]= useState("");
  
  const userId = user.uid;

  const handleUpdate = async (e) => {
    e.preventDefault()
    const DocRef = doc(db,'users', userId)
    try{
      await updateDoc(DocRef, {

        phoneNumber: phoneNoPara,
      
      })

      alert('Your profile is ready')
    } catch (err) {
      alert(err)
    }    
  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        Update
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body>Woohoo, you're reading this text in a modal!</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onSubmit={} onClick={handleClose}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

render(<Example />);