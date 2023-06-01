import React, { useState, useEffect, useRef } from 'react';
import './component-styles/ridesearch.css';
import { useJsApiLoader, Autocomplete } from '@react-google-maps/api';
import { db } from '../firebaseConfig';
import { addDoc, collection, doc, getDocs, collectionGroup } from 'firebase/firestore';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { UserAuth } from '../context/UserAuthContext';

const Ride = () => {
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [timestamp, setTimestamp] = useState('');
  const [vehicleCapacity, setVehicleCapacity] = useState('');
  const [riderName, setRiderName] = useState('');
  const authContext = UserAuth();

  useEffect(() => {
    const fetchRiderName = async () => {
        const currentUserUid = authContext.user ? authContext.user.uid : null;

        try {
            const riderInfoCollectionRef = collectionGroup(db, 'riderinfo');
            const querySnapshot = await getDocs(riderInfoCollectionRef);
      
            querySnapshot.forEach((doc) => {
              if (doc.ref.path.includes(`users/${currentUserUid}/riderprogram`)) {
                const riderInfoData = doc.data();
                const riderName = riderInfoData.name;
                setRiderName(riderName);
                console.log(riderName)
              }
            });
          } catch (error) {
            console.error('Error fetching rider name:', error);
          }
        };
    fetchRiderName();
  }, [authContext.user]);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GMAPS_KEY,
    libraries: ['places'],
  });

  const originRef = useRef();
  const destinationRef = useRef();

  if (!isLoaded) {
    return <p style={{ textAlign: 'center' }}> Loading... </p>;
  }
  
  const submit = async (e) => {
    e.preventDefault();
    try {
      const currentUserUid = authContext.user ? authContext.user.uid : null;

      if (currentUserUid) {
        const ride = {
          start_loc: source,
          end_loc: destination,
          departure_time: timestamp,
          createdAt: new Date(),
          rider_name: riderName,
          ride_status: 'active',
          seats: vehicleCapacity,
          user_id: authContext.user.uid,
        };

        const rideRef = await addDoc(collection(db, 'rides'), ride);

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
    <>
      <div className='driver-container my-3'>
        <h3 className='page-title'>Post A Ride</h3>
        <Form onSubmit={submit}>
          <Form.Group className='mb-3'>
            <Form.Label>Source</Form.Label>
            <Autocomplete
              className='auto'
              options={{
                componentRestrictions: { country: 'ind' },
              }}
            >
              <input
                type='text'
                placeholder='📍From'
                className='phold'
                ref={originRef}
                onChange={(e) => setSource(e.target.value)}
              />
            </Autocomplete>
          </Form.Group>
          <Form.Group className='mb-3'>
            <Form.Label>Destination</Form.Label>
            <Autocomplete
              className='auto'
              options={{
                componentRestrictions: { country: 'ind' },
              }}
            >
              <input
                type='text'
                placeholder='📍To'
                className='phold'
                ref={destinationRef}
                onChange={(e) => setDestination(e.target.value)}
              />
            </Autocomplete>
          </Form.Group>
          <Form.Group className='mb-3'>
            <Form.Label>Vehicle Capacity</Form.Label>
            <Form.Control
              type='number'
              min='1'
              max='9'
              value={vehicleCapacity}
              onChange={(e) => setVehicleCapacity(e.target.value)}
              placeholder='Enter vehicle capacity'
              required
            />
          </Form.Group>
          <Form.Group className='mb-3'>
            <Form.Label>Timestamp</Form.Label>
            <Form.Control
              type='datetime-local'
              value={timestamp}
              onChange={(e) => setTimestamp(e.target.value)}
              required
            />
          </Form.Group>
          <Button size='lg' variant='success' className='driver-btn' type='submit'>
            Post Ride
          </Button>
        </Form>
      </div>
    </>
  );
};

export default Ride;