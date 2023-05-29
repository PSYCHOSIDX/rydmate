import React, { useState } from 'react';
import '../components/component-styles/driverpage.css';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { UserAuth } from '../context/UserAuthContext';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

const Ride = () => {
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [timestamp, setTimestamp] = useState('');
  const [vehicleCapacity, setVehicleCapacity] = useState('');


  const authContext = UserAuth();

  const submit = async (e) => {
    e.preventDefault();

    try {
      // Get the current user's UID
      const currentUserUid = authContext.user ? authContext.user.uid : null;

      if (currentUserUid) {
        // Create a new ride object
        const ride = {
          start_loc: source,
          end_loc: destination,
          departure_time: timestamp,
          createdAt: new Date(),
          rider_name: authContext.user.displayName,
          ride_status:"active",
          seats:vehicleCapacity,

          // ride_id:2,
          // cost_per_seat:100,
          // toal_cost:400,
          // total_distance:67,
          // user_id:1,
          // vnumber:"GA 01 M 2345",
          // vtype:"SUV"

        };

        // Save the ride object in Firestore
        const rideRef = await addDoc(collection(db, 'rides'), ride);

        // Reset the form fields
        setSource('');
        setDestination('');
        setTimestamp('');
        setVehicleCapacity('');

        console.log('Ride posted successfully!');
        console.log('Ride ID:', rideRef.id);
      } else {
        console.error('User not found.');
      }
    } catch (error) {
      console.error('Error posting ride:', error);
    }
  };

  return (
    <div className='driver-container my-3'>
      <h3 className='page-title'>Post A Ride</h3>
      <Form onSubmit={submit}>
        {/* Source */}
        <Form.Group className='mb-3'>
          <Form.Label>Source</Form.Label>
          <Form.Control
            type='text'
            value={source}
            onChange={(e) => setSource(e.target.value)}
            placeholder='📍From'
            required
          />
        </Form.Group>

        {/* Destination */}
        <Form.Group className='mb-3'>
          <Form.Label>Destination</Form.Label>
          <Form.Control
            type='text'
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder='📍To'
            required
          />
        </Form.Group>

        {/* Timestamp */}
        <Form.Group className='mb-3'>
          <Form.Label>departure time</Form.Label>
          <Form.Control
            type='datetime-local'
            value={timestamp}
            onChange={(e) => setTimestamp(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className='mb-3'>
    <Form.Label>Vehicle Capacity</Form.Label>
    <Form.Control
      type='text'
      value={vehicleCapacity}
      onChange={(e) => setVehicleCapacity(e.target.value)}
      placeholder='Enter seats available'
      pattern="[0-9]+"
      title="Vehicle capacity should be a valid number"
      required
    />
  </Form.Group>

        <Button size='lg' variant='success' className='driver-btn' type='submit'>
          Post Ride
        </Button>
      </Form>
    </div>
  );
};

export default Ride;
