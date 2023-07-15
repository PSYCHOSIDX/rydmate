import React, { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import './component-styles/ridesearch.css';
import { db } from '../firebaseConfig';
import { collection, getDoc, getDocs, query, where, doc, updateDoc } from 'firebase/firestore';
import { UserAuth } from '../context/UserAuthContext';
import { Link } from 'react-router-dom';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ActiveUserRides = () => {
  const authContext = UserAuth();
  const currentUserUid = authContext.user && authContext.user.uid;

  const [rides, setRides] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [ridesPostedExists, setRidesPostedExists] = useState(true);
  
  
  const [acceptedRide, setAcceptedRide] = useState(null);

  useEffect(() => {
    const checkRequestStatus = async () => {
      try {
        // Retrieve the acceptance status from the user's document in Firestore
        const userRef = doc(db, 'users', currentUserUid); // Replace 'userId' with the actual user ID
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          const { request_accepted, ride_id } = userData;

          if (request_accepted && ride_id) {
            // Show a notification or handle the acceptance status
            setAcceptedRide(ride_id);
            const rideRef = doc(db, 'rides', ride_id); // Replace 'ride_id' with the actual ride ID
            const rideDoc = await getDoc(rideRef);
            const rideData = rideDoc.data();
            
            toast.success(`Your request for the ride from ${rideData.start_loc} to ${rideData.end_loc} has been accepted!`);
          }

          // Update the acceptance status in the user's document to indicate it has been viewed
          await updateDoc(userRef, { request_accepted: false, ride_id: '' });
        }
      } catch (error) {
        console.error('Error retrieving request status:', error);
      }
    };

    checkRequestStatus();
  }, [currentUserUid]);

  useEffect(() => {
    const fetchRides = async () => {
      try {
        if (!currentUserUid) {
            setIsLoading(false);
            return;
          }

        const carpoolsJoinedRef = collection(db,'users', currentUserUid, 'CarpoolsJoined');
        const querySnapshot = await getDocs(carpoolsJoinedRef);
        if (querySnapshot.empty) {
            setRidesPostedExists(false);
          }else {
        const rideIds = querySnapshot.docs.map((doc) => doc.data().ride_id);
        const ridesRef = collection(db, 'rides');
        const q = query(ridesRef, where('ride_id', 'in', rideIds));
        const qq = query(q, where('ride_status', '==', 'active'));

        const ridesSnapshot = await getDocs(qq);
        const ridesData = ridesSnapshot.docs.map((doc) => doc.data());
        // console.log('Rides data:', ridesData);
        setRides(ridesData);
          }
          setIsLoading(false);
      } catch (error) {
        console.error('Error fetching rides:', error);
      }
    };
         

    fetchRides();
  }, [currentUserUid]);

  const handlePhoneCall = (contact) => {
    window.location.href = `tel:${contact}`;
  };

  if (isLoading) {
    return <p>Loading Carpools...</p>;
  }
    



  return (
    <>
      <div className="ride-results">
        <div className="ride-head">
          <h2 > 
              Active Carpools</h2>
        </div>
      </div>

      <div className="card-results">
        {rides.length === 0 ? (
          <h2>No active carpools currently.
            <Link to="/rides" className='link'>
           search for a ride 
          </Link></h2>
        ) : (
          <Container className="gridbox">
            <Row className="gridrow">
            {rides.map((ride) => (
               <div key={ride.ride_id} className="ride-card">
               <h2 id="loc">
                    {ride.start_loc} to {ride.end_loc}
                   </h2>
                   <div className="line"> </div>

                   <h2 className="type">Vehicle name</h2>
                   <h2 id="type">{ride.vehicle_name}</h2>
                   <h2 className="type">Vehicle type</h2>
                   <h3 id="type">{ride.vehicle_type}</h3>
                   <h2 className="type">Vehicle No</h2>
                   <h3 id="type">{ride.vehicle_number}</h3>
                   <h2 className="type">Departure Time</h2>
                   <h3 id="type">{ride.departure_time.substring(0,35).replace('T',' ')}</h3>
                   {/* <h2 className="type">Ride Status</h2>
                   <h3 id="type">{ride.ride_status}</h3> */}
                   {/* <h5 id="cost">Cost Per Km</h5> */}
                   {/* <h2 id="realcost">{ride.cost_per_km}</h2> */}

                   <div className="line" style={{backgroundColor: 'black' }}> </div>

                   <h2 id="type">pickup otp: {ride.ride_otp}</h2>
                   <h2 id="type">drop otp: {ride.drop_otp}</h2>

                   <input type="button" value={ride.rider_contact} onClick={() => handlePhoneCall(ride.rider_contact)} className="ride-join"/>
                </div>     
 
      ))}
      </Row>
          </Container>
        )}
      </div>
      {acceptedRide && <p>Your request for Ride ID {acceptedRide} has been accepted!</p>}
      <ToastContainer />
    </>
  );
};

export default ActiveUserRides;
