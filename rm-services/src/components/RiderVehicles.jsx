import React, { useState } from 'react';
import '../components/component-styles/driverpage.css';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import ProgressBar from 'react-bootstrap/ProgressBar';
import { UserAuth } from '../context/UserAuthContext';
import { addDoc, collection } from 'firebase/firestore';
import { storage, db } from '../firebaseConfig';
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from 'firebase/storage';

const RiderVehicle = () => {
  const [vehicleOwner, setVehicleOwner] = useState('');
  const [vehicleName, setVehicleName] = useState('');
  const [vehicleRegId, setVehicleRegId] = useState('');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [vehicleType, setVehicleType] = useState('');
  const [vehicleCapacity, setVehicleCapacity] = useState('');
  const [carImage, setCarImage] = useState(null);
  const [carUploadProgress, setCarUploadProgress] = useState(0); // Progress state for car image

  const handleCarImageChange = (e) => {
    setCarImage(e.target.files[0]);
  };

  const uploadFile = async (file, setProgress) => {
    const storageRef = ref(storage, file.name);
    const uploadTask = uploadBytesResumable(storageRef, file);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProgress(progress); // Update the progress state
          switch (snapshot.state) {
            case 'paused':
              console.log('Upload paused');
              break;
            case 'running':
              console.log('Upload running');
              break;
            default:
              console.log('Upload state: ' + snapshot.state);
              break;
          }
        },
        (error) => {
          console.log(error);
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadedURL) => {
            resolve(downloadedURL);
          });
        }
      );
    });
  };

  const handleVehicleCapacityChange = (e) => {
    const value = parseInt(e.target.value, 10);
    setVehicleCapacity(value);
  };

  const authContext = UserAuth();
 
  const submit = async (e) => {
    e.preventDefault();

    try {

        const currentUserUid = authContext.user ? authContext.user.uid : null;

      if (currentUserUid) {

        const carImageUrl = carImage
          ? await uploadFile(carImage, setCarUploadProgress)
          : null;

          let costPerKm = 0;
      if (vehicleType === 'suv') {
        costPerKm = 6;
      } else if (vehicleType === 'hatchback') {
        costPerKm = 5;
      } else if (vehicleType === 'bike') {
        costPerKm = 3;
      }

      await addDoc(collection(db, 'users', currentUserUid, 'riderprogram', currentUserUid,'vehicleinfo'), {
          vehicleOwner,
          vehicleName,
          vehicleRegId,
          vehicleNumber,
          vehicleType,
          vehicleCapacity,
          costPerKm,
          carImageUrl,
          verified_vehicle:false,
        });


        setVehicleOwner('');
        setVehicleName('');
        setVehicleRegId('');
        setVehicleNumber('');
        setVehicleType('');
        setVehicleCapacity('');
        setCarImage(null);

        setCarUploadProgress(0);

        console.log('Form submitted successfully!');
      } else {
        console.error('User not found.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <div className='driver-container my-3'>
      <h3 className='page-title'>Driver Details</h3>
      <Form onSubmit={submit}>
        <Form.Group className='mb-3' controlId='formBasicvehicleOwner'>
          <Form.Label>Vehicle Owner</Form.Label>
          <Form.Control
            type='text'
            value={vehicleOwner}
            onChange={(e) => setVehicleOwner(e.target.value)}
            placeholder='Enter vehicle owners name'
            required
          />
        </Form.Group>
        <Form.Group className='mb-3' controlId='formBasicvehicleName'>
          <Form.Label>Vehicle Name</Form.Label>
          <Form.Control
            type='text'
            value={vehicleName}
            onChange={(e) => setVehicleName(e.target.value)}
            placeholder='Enter vehicle name'
            required
          />
        </Form.Group>
        <Form.Group className='mb-3' controlId='formBasicvehicleRegId'>
          <Form.Label>Vehicle Registration ID</Form.Label>
          <Form.Control
            type='text'
            value={vehicleRegId}
            onChange={(e) => setVehicleRegId(e.target.value)}
            placeholder='Enter vehicle registration id'
            required
          />
        </Form.Group>
        <Form.Group className='mb-3' controlId='formBasicvehicleNumber'>
          <Form.Label>Vehicle Number</Form.Label>
          <Form.Control
            type='text'
            value={vehicleNumber}
            onChange={(e) => setVehicleNumber(e.target.value)}
            placeholder='Enter vehicle number'
            required
          />
        </Form.Group>
        <Form.Group className='mb-3'>
          <Form.Label>Vehicle Type</Form.Label>
          <Form.Select
            value={vehicleType}
            onChange={(e) => setVehicleType(e.target.value)}
            required
          >
            <option value=''>Select vehicle type</option>
            <option value='bike'>Bike</option>
            <option value='suv'>SUV</option>
            <option value='hatchback'>Hatchback</option>
          </Form.Select>
        </Form.Group>
        <Form.Group className='mb-3'>
          <Form.Label>Vehicle Capacity</Form.Label>
          <Form.Control
            type='number'
            min='1'
            max='9'
            value={vehicleCapacity}
            onChange={handleVehicleCapacityChange}
            placeholder='Enter vehicle capacity'
            required
          />
        </Form.Group>

        <Form.Group className='mb-3'>
          <Form.Label>Car Image</Form.Label>
          <Form.Control type='file' onChange={handleCarImageChange} required/>
        </Form.Group>
        <ProgressBar now={carUploadProgress} label={`${carUploadProgress}%`} />

        <Button size='lg' variant='success' className='driver-btn' type='submit'>
          Submit
        </Button>
      </Form>
    </div>
  );
};

export default RiderVehicle;
