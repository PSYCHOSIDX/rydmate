import React, { useState, useEffect, useRef } from 'react';
import { useJsApiLoader, Autocomplete } from '@react-google-maps/api';
import { db } from '../firebaseConfig';
import { addDoc, collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { UserAuth } from '../context/UserAuthContext';
import { useNavigate } from 'react-router-dom';

const libraries = ['places'];

const Ride = () => {
  const navigate = useNavigate();

  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [timestamp, setTimestamp] = useState('');
  const [vehicleCapacity, setVehicleCapacity] = useState('');
  const [riderName, setRiderName] = useState('');
  const [vehicleOptions, setVehicleOptions] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState('');

  const [showForm, setShowForm] = useState(false);
  const [formError, setFormError] = useState('');

  const authContext = UserAuth();
  const currentUserUid = authContext.user ? authContext.user.uid : null;

  useEffect(() => {
    if (currentUserUid) {
      const fetchRiderName = async () => {
        try {
          const riderInfoCollectionRef = collection(
            db,
            'users',
            currentUserUid,
            'riderprogram',
            currentUserUid,
            'riderinfo'
          );
          const riderInfoSnapshot = await getDocs(riderInfoCollectionRef);

          if (!riderInfoSnapshot.empty) {
            const riderInfoData = riderInfoSnapshot.docs[0].data();
            const riderName = riderInfoData.name;
            const verified = riderInfoData.verified_rider;

            setRiderName(riderName);
            setShowForm(verified);
            console.log(verified);
          }
        } catch (error) {
          console.error('Error fetching rider name:', error);
        }
      };

      fetchRiderName();
    }
  }, [currentUserUid]);

  useEffect(() => {
    if (currentUserUid) {
      const fetchVerifiedVehicles = async () => {
        try {
          const vehiclesInfoCollectionRef = collection(
            db,
            'users',
            currentUserUid,
            'riderprogram',
            currentUserUid,
            'vehicleinfo'
          );
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
    }
  }, [currentUserUid]);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GMAPS_KEY,
    libraries: libraries,
  });

  const originRef = useRef(null);
  const destinationRef = useRef(null);

  if (!isLoaded) {
    return <p style={{ textAlign: 'center' }}> Loading... </p>;
  }

  const submit = async (e) => {
    e.preventDefault();
    try {
      const currentUserUid = authContext.user ? authContext.user.uid : null;

      if (currentUserUid && selectedVehicle) {
        const maxcap = selectedVehicle.vehicleCapacity;
        const capacity = parseInt(vehicleCapacity, 10);

        if (capacity > maxcap) {
          setFormError('Invalid capacity entered.');
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
          cost_per_km: selectedVehicle.costPerKm,
          user_id: authContext.user.uid,
          vehicle_image: selectedVehicle.carImageUrl,
          ride_otp: 4444,
        };

        const rideRef = await addDoc(collection(db, 'rides'), ride);
        const rideId = rideRef.id;
        const rideposted = collection(
          db,
          'users',
          authContext.user.uid,
          'ridesposted'
        );

        await addDoc(rideposted, {
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
          cost_per_km: selectedVehicle.costPerKm,
          user_id: authContext.user.uid,
          vehicle_image: selectedVehicle.carImageUrl,
          ride_otp: 4444,
          ride_id: rideId,
        });

        await updateDoc(doc(db, 'rides', rideId), { ride_id: rideId });

        setSource('');
        setDestination('');
        setTimestamp('');
        setVehicleCapacity('');
        setSelectedVehicle('');
        setFormError('');
        setSelectedVehicle('');

        console.log('Ride posted successfully!');
        console.log('Ride ID:', rideRef.id);
        navigate('/');
      } else {
        console.error('User not found or no vehicle selected.');
      }
    } catch (error) {
      console.error('Error posting ride:', error);
    }
  };
  if (!showForm) {
    return null; // Render nothing if the form should not be shown
  }
  return (
    <>
      <div className='driver-container my-3'>
        <h3 className='page-title'>Post A Ride</h3>
        <Form onSubmit={submit}>
          <Form.Group className='mb-3'>
            <Form.Label>Source</Form.Label>
            <Autocomplete
              onLoad={(autocomplete) => {
                autocomplete.setFields(['place_id', 'formatted_address']);
                originRef.current = autocomplete;
              }}
              onPlaceChanged={() => {
                const place = originRef.current.getPlace();
                if (place) {
                  setSource(place.formatted_address);
                }
              }}
              options={{
                componentRestrictions: { country: 'ind' },
              }}
            >
              <input
                type='text'
                placeholder='📍From'
                className='form-control'
                onChange={(e) => setSource(e.target.value)}
              />
            </Autocomplete>
          </Form.Group>
          <Form.Group className='mb-3'>
            <Form.Label>Destination</Form.Label>
            <Autocomplete
              onLoad={(autocomplete) => {
                autocomplete.setFields(['place_id', 'formatted_address']);
                destinationRef.current = autocomplete;
              }}
              onPlaceChanged={() => {
                const place = destinationRef.current.getPlace();
                if (place) {
                  setDestination(place.formatted_address);
                }
              }}
              options={{
                componentRestrictions: { country: 'ind' },
              }}
            >
              <input
                type='text'
                placeholder='📍To'
                className='form-control'
                onChange={(e) => setDestination(e.target.value)}
              />
            </Autocomplete>
          </Form.Group>
          <Form.Group className='mb-3'>
            <Form.Label>Departure Time</Form.Label>
            <input
              type='datetime-local'
              className='form-control'
              onChange={(e) => setTimestamp(e.target.value)}
            />
          </Form.Group>
          <Form.Group className='mb-3'>
            <Form.Label>Select Vehicle</Form.Label>
            <Form.Control
              as='select'
              onChange={(e) =>
                setSelectedVehicle(vehicleOptions[e.target.value])
              }
            >
              <option value=''>Select Vehicle</option>
              {vehicleOptions.map((vehicle, index) => (
                <option key={index} value={index}>
                  {vehicle.vehicleName}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
          <Form.Group className='mb-3'>
            <Form.Label>Seats Available</Form.Label>
            <Form.Control
              type='number'
              placeholder='Enter number of seats'
              min='1'
              max={selectedVehicle ? selectedVehicle.vehicleCapacity : ''}
              value={vehicleCapacity}
              onChange={(e) => setVehicleCapacity(e.target.value)}
            />
          </Form.Group>
          {formError && <p className='text-danger'>{formError}</p>}
          <Button type='submit' variant='primary'>
            Post Ride
          </Button>
        </Form>
      </div>
    </>
  );
};

export default Ride;
