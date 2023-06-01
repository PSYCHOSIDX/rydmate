import React, { useState, useEffect, useRef } from 'react';
import './component-styles/ridesearch.css';
import { useJsApiLoader, Autocomplete } from '@react-google-maps/api';
import { db } from '../firebaseConfig';
import { addDoc, collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { UserAuth } from '../context/UserAuthContext';

const Ride = () => {
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [timestamp, setTimestamp] = useState('');
  const [vehicleCapacity, setVehicleCapacity] = useState('');
  const [riderName, setRiderName] = useState('');
  const [vehicleOptions, setVehicleOptions] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const authContext = UserAuth();
  const currentUserUid = authContext.user ? authContext.user.uid : null;

  useEffect(() => {
    const fetchRiderName = async () => {
      try {
        const riderInfoCollectionRef = collection(db, 'users', currentUserUid, 'riderprogram', currentUserUid, 'riderinfo');
        const riderInfoSnapshot = await getDocs(riderInfoCollectionRef);

        if (!riderInfoSnapshot.empty) {
          const riderInfoData = riderInfoSnapshot.docs[0].data();
          const riderName = riderInfoData.name;
          setRiderName(riderName);
        }
      } catch (error) {
        console.error('Error fetching rider name:', error);
      }
    };

    fetchRiderName();
  }, [currentUserUid]);

  useEffect(() => {
    const fetchVerifiedVehicles = async () => {
      try {
        const vehiclesInfoCollectionRef = collection(db,'users', currentUserUid, 'riderprogram', currentUserUid,  'vehicleinfo');
        const querySnapshot = await getDocs(vehiclesInfoCollectionRef);
        if (!querySnapshot.empty) {
          const verifiedVehicles = querySnapshot.docs
            .filter((doc) => doc.data().verified_vehicle === true)
            .map((doc) => doc.data());

          setVehicleOptions(verifiedVehicles);
        }
      } catch (error) {
        console.error('Error fetching verified vehicles:', error);
      }
    };

    fetchVerifiedVehicles();
  }, [currentUserUid]);

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

      if (currentUserUid && selectedVehicle) {
        const maxcap= selectedVehicle.vehicleCapacity;
        const capacity = parseInt(vehicleCapacity, 10);

        // console.log(maxcap)
        // console.log(capacity)

        if (isNaN(capacity) || capacity > maxcap) {
          console.error('Invalid capacity entered.');
          return;
        }
        const ride = {
          start_loc: source,
          end_loc: destination,
          departure_time: timestamp,
          createdAt: new Date(),
          rider_name: riderName,
          ride_status: 'active',
          seats: vehicleCapacity,
          vehicle_name: selectedVehicle.vehicleName,
          vehicle_number: selectedVehicle.vehicleNumber,
          vehicle_type: selectedVehicle.vehicleType,
          user_id: authContext.user.uid,
          ride_otp: 4444,
        };

        const rideRef = await addDoc(collection(db, 'rides'), ride);
        const rideId = rideRef.id;

      await updateDoc(doc(db, 'rides', rideId), { ride_id: rideId });


        setSource('');
        setDestination('');
        setTimestamp('');
        setVehicleCapacity('');
        setSelectedVehicle('');

        console.log('Ride posted successfully!');
        console.log('Ride ID:', rideRef.id);
      } else {
        console.error('User not found or no vehicle selected.');
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
              options={{
                componentRestrictions: { country: 'ind' },
              }}
            >
              <input
                type='text'
                placeholder='📍From'
                className='form-control'
                ref={originRef}
                onChange={(e) => setSource(e.target.value)}
              />
            </Autocomplete>
          </Form.Group>
          <Form.Group className='mb-3'>
            <Form.Label>Destination</Form.Label>
            <Autocomplete
              options={{
                componentRestrictions: { country: 'ind' },
              }}
            >
              <input
                type='text'
                placeholder='📍To'
                className='form-control'
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
          <Form.Group className='mb-3'>
            <Form.Label>Vehicle Name</Form.Label>
            <Form.Control as='select' required onChange={(e) => setSelectedVehicle(vehicleOptions[e.target.selectedIndex - 1])}>
              <option value=''>Select a vehicle</option>
              {vehicleOptions.map((option, index) => (
                <option key={index} value={option.vehicleName}>
                  {option.vehicleName}
                </option>
              ))}
            </Form.Control>
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


