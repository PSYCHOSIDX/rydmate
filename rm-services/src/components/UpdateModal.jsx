import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { UserAuth } from '../context/UserAuthContext';
import { updateDoc, doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import Form from 'react-bootstrap/Form';
import '../components/component-styles/userprofile.css';
import RealAlert from './RealAlert';

function Example() {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const { user } = UserAuth();

  const [phoneNumberData, setPhoneNumber] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const userId = user.uid;

  const handleUpdate = async (e) => {
    e.preventDefault();

    const userDetailsRef = doc(db, 'users', userId, 'details', userId);
    const userDetailsDoc = await getDoc(userDetailsRef);

    try {
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
      }, 3000);

      if (userDetailsDoc.exists()) {
        // Update existing document
        await updateDoc(userDetailsRef, {
          phoneNumber: phoneNumberData,
        });
      } else {
        // Create new document
        await setDoc(userDetailsRef, {
          phoneNumber: phoneNumberData,
        });
      }
    } catch (err) {
      alert(err);
    }
  };

  useEffect(() => {
    const fetchPhoneNumber = async () => {
      const userDetailsRef = doc(db, 'users', userId, 'details', userId);
      const userDetailsDoc = await getDoc(userDetailsRef);

      if (userDetailsDoc.exists()) {
        const userDetails = userDetailsDoc.data();
        if (userDetails.phoneNumber) {
          setPhoneNumber(userDetails.phoneNumber);
        }
      }
    };

    fetchPhoneNumber();
  }, [userId]);

  return (
    <>
      <Button id="update-button" onClick={handleShow}>
        Update Contact
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Update Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {showAlert ? <RealAlert message="Account Updated Successfully" /> : null}
          <Form xs="auto" className="sign-form" onSubmit={handleUpdate}>
            <Form.Group className="mb-3 none" controlId="formBasicPassword">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                onChange={(e) => setPhoneNumber(e.target.value)}
                type="tel"
                name="phoneNumber"
                id="phoneNumber"
                pattern="[0-9]{10}"
                placeholder="Enter Phone Number"
                required
                value={phoneNumberData}
              />
            </Form.Group>

            <Button variant="success" type="submit">
              Save changes
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default Example;
