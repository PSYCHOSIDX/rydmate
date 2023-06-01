import React, { useState, useEffect } from 'react';
import '../components/component-styles/driverpage.css';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import ProgressBar from 'react-bootstrap/ProgressBar';
import { UserAuth } from '../context/UserAuthContext';
import { addDoc, collection, getDocs, updateDoc } from 'firebase/firestore';
import { storage, db } from '../firebaseConfig';
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from 'firebase/storage';

import { useNavigate} from "react-router-dom";


const RiderInfo = () => {
  const navigate = useNavigate()
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [aadharNumber, setAadharNumber] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [licenseImage, setLicenseImage] = useState(null);
  const [aadharImage, setAadharImage] = useState(null);
  const [licenseUploadProgress, setLicenseUploadProgress] = useState(0);
  const [aadharUploadProgress, setAadharUploadProgress] = useState(0);

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
          setProgress(progress);
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
  const currentUserUid = authContext.user ? authContext.user.uid : null;

  useEffect(() => {
    const fetchRiderInfo = async () => {
      try {
        if (currentUserUid) {
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
            setName(riderInfoData.name);
            setEmail(riderInfoData.email);
            setPhoneNumber(riderInfoData.phoneNumber);
            setAadharNumber(riderInfoData.aadharNumber);
            setLicenseNumber(riderInfoData.licenseNumber);
            setLicenseImage(riderInfoData.licenseImageUrl);
            setAadharImage(riderInfoData.aadharImageUrl);
          }
        }
      } catch (error) {
        console.error('Error fetching rider info:', error);
      }
    };

    fetchRiderInfo();
  }, [currentUserUid]);


  const submit = async (e) => {
    e.preventDefault();

    try {
      // const currentUserUid = authContext.user ? authContext.user.uid : null;

      if (currentUserUid) {
        const licenseImageUrl = licenseImage
          ? await uploadFile(licenseImage, setLicenseUploadProgress)
          : null;
        const aadharImageUrl = aadharImage
          ? await uploadFile(aadharImage, setAadharUploadProgress)
          : null;

          const riderInfoCollectionRef = collection(db, 'users', currentUserUid, 'riderprogram',currentUserUid, 'riderinfo');
          const riderInfoSnapshot = await getDocs(riderInfoCollectionRef);

          if (riderInfoSnapshot.empty) {
            await addDoc(riderInfoCollectionRef, {
              name,
              email,
              phoneNumber,
              aadharNumber,
              licenseNumber,
              licenseImageUrl,
              aadharImageUrl,
              verified_rider: false,
            });
          } else {

            const riderInfoDocRef = riderInfoSnapshot.docs[0].ref;
            await updateDoc(riderInfoDocRef, {
              name,
              email,
              phoneNumber,
              aadharNumber,
              licenseNumber,
              licenseImageUrl,
              aadharImageUrl,
              verified_rider: false,
            });
          }
          

        setName('');
        setEmail('');
        setPhoneNumber('');
        setAadharNumber('');
        setLicenseNumber('');
        setLicenseImage(null);
        setAadharImage(null);
        setLicenseUploadProgress(0);
        setAadharUploadProgress(0);

        console.log('Form submitted successfully!');
        navigate('/vehicleinfo')
      } else {
        console.error('User not found.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <div className='driver-container my-3'>
      <h3 className='page-title'>Riders Details</h3>
      <Form onSubmit={submit}>
        <Form.Group className='mb-3' controlId='formBasicName'>
          <Form.Label>Name</Form.Label>
          <Form.Control
            type='text'
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder='Enter name'
            required
          />
        </Form.Group>

        <Form.Group className='mb-3' controlId='formBasicEmail'>
          <Form.Label>Email</Form.Label>
          <Form.Control
            type='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder='Enter email'
            required
          />
        </Form.Group>

        <Form.Group className='mb-3' controlId='formBasicPhoneNumber'>
          <Form.Label>Phone Number</Form.Label>
          <Form.Control
            type='tel'
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            pattern="[0-9]{10}"
            placeholder='Enter phone number'
            required
          />
        </Form.Group>

        <Form.Group className='mb-3' controlId='formBasicAadharNumber'>
          <Form.Label>Aadhar Number</Form.Label>
          <Form.Control
            type='text'
            value={aadharNumber}
            onChange={(e) => setAadharNumber(e.target.value)}
            placeholder='Enter Aadhar number'
            pattern="[0-9]{12}"
            title="Aadhar number should be a 12-digit number"
            required
          />
        </Form.Group>

        <Form.Group className='mb-3' controlId='formBasicLicenseNumber'>
          <Form.Label>License Number</Form.Label>
          <Form.Control
            type='text'
            value={licenseNumber}
            onChange={(e) => setLicenseNumber(e.target.value)}
            placeholder='Enter license number'
            required
          />
        </Form.Group>

        <Form.Group className='mb-3'>
          <Form.Label>Driver's License Image</Form.Label>
          <Form.Control type='file' onChange={handleLicenseImageChange} />
        </Form.Group>
        <ProgressBar now={licenseUploadProgress} label={`${licenseUploadProgress}%`} />

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

export default RiderInfo;