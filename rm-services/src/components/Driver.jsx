
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

const Driver = () => {
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [vehicleType, setVehicleType] = useState('');
  const [aadharNumber, setAadharNumber] = useState('');
  const [vehicleCapacity, setVehicleCapacity] = useState('');
  const [carImage, setCarImage] = useState(null);
  const [licenseImage, setLicenseImage] = useState(null);
  const [aadharImage, setAadharImage] = useState(null);
  const [carUploadProgress, setCarUploadProgress] = useState(0); // Progress state for car image
  const [licenseUploadProgress, setLicenseUploadProgress] = useState(0); // Progress state for license image
  const [aadharUploadProgress, setAadharUploadProgress] = useState(0); // Progress state for aadhar image

  const handleCarImageChange = (e) => {
    setCarImage(e.target.files[0]);
  };

  const handleLicenseImageChange = (e) => {
    setLicenseImage(e.target.files[0]);
  };

  const handleAadharImageChange = (e) => {
    setAadharImage(e.target.files[0]);
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

  const authContext = UserAuth();

  const submit = async (e) => {
    e.preventDefault();

    try {
      // Get the current user's UID
      const currentUserUid = authContext.user ? authContext.user.uid : null;

      if (currentUserUid) {
        // Upload car image
        const carImageUrl = carImage
          ? await uploadFile(carImage, setCarUploadProgress)
          : null;
        // Upload license image
        const licenseImageUrl = licenseImage
          ? await uploadFile(licenseImage, setLicenseUploadProgress)
          : null;
        // Upload Aadhar image
        const aadharImageUrl = aadharImage
          ? await uploadFile(aadharImage, setAadharUploadProgress)
          : null;

        // Create a new document in the "details" collection under "users"
        await addDoc(collection(db, 'users', currentUserUid, 'details'), {
          vnumber: vehicleNumber,
          vtype: vehicleType,
          aadharNumber: aadharNumber,
          seats: vehicleCapacity,
          carImageUrl: carImageUrl,
          licenseImageUrl: licenseImageUrl,
          aadharImageUrl: aadharImageUrl,
        });

        // Reset the form fields
        setVehicleNumber('');
        setVehicleType('');
        setAadharNumber('');
        setVehicleCapacity('');
        setCarImage(null);
      setLicenseImage(null);
      setAadharImage(null);

      // Reset the progress bars
      setCarUploadProgress(0);
      setLicenseUploadProgress(0);
      setAadharUploadProgress(0);
         
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
        {/* Form fields */}
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
          <Form.Control
            type='text'
            value={vehicleType}
            onChange={(e) => setVehicleType(e.target.value)}
            placeholder='Enter vehicle type'
            required
          />
        </Form.Group>
        <Form.Group className='mb-3'>
          <Form.Label>Aadhar Number</Form.Label>
          <Form.Control
            type='text'
            value={aadharNumber}
            onChange={(e) => setAadharNumber(e.target.value)}
            placeholder='Enter Aadhar number'
            required
          />
        </Form.Group>

        <Form.Group className='mb-3'>
          <Form.Label>Vehicle Capacity</Form.Label>
          <Form.Control
            type='text'
            value={vehicleCapacity}
            onChange={(e) => setVehicleCapacity(e.target.value)}
            placeholder='Enter vehicle capacity'
            required
          />
        </Form.Group>

        {/* Car Image */}
        <Form.Group className='mb-3'>
          <Form.Label>Car Image</Form.Label>
          <Form.Control type='file' onChange={handleCarImageChange} />
        </Form.Group>
        <ProgressBar now={carUploadProgress} label={`${carUploadProgress}%`} />

        {/* Driver's License Image */}
        <Form.Group className='mb-3'>
          <Form.Label>Driver's License Image</Form.Label>
          <Form.Control type='file' onChange={handleLicenseImageChange} />
        </Form.Group>
        <ProgressBar now={licenseUploadProgress} label={`${licenseUploadProgress}%`} />

        {/* Aadhar Card Image */}
        <Form.Group className='mb-3'>
          <Form.Label>Aadhar Card Image</Form.Label>
          <Form.Control type='file' onChange={handleAadharImageChange} />
        </Form.Group>
        <ProgressBar now={aadharUploadProgress} label={`${aadharUploadProgress}%`} />

        <Button size='lg' variant='success' className='driver-btn' type='submit'>
          Submit
        </Button>
      </Form>
    </div>
  );
};

export default Driver;
