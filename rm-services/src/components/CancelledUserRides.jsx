import React, { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import './component-styles/ridesearch.css';
import { db } from '../firebaseConfig';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { UserAuth } from '../context/UserAuthContext';
import { Link } from 'react-router-dom';

const CancelledUserRides = () => {
        const authContext = UserAuth();
        const currentUserUid = authContext.user && authContext.user.uid;
      
        const [rides, setRides] = useState([]);
        const [isLoading, setIsLoading] = useState(true);
        const [ridesPostedExists, setRidesPostedExists] = useState(true);
        
      
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
              const qq = query(q, where('ride_status', '==', 'cancelled'));
      
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
        }, []);
      
        if (isLoading) {
          return <p>Loading Carpools...</p>;
        }
          

  return (
    <>
      <div className="ride-results">
        <div className="ride-head">
          <h2>Cancelled Carpools</h2>
        </div>
      </div>

      <div className="card-results">
        { rides.length === 0 ? (
          <p>No cancelled carpools yet.</p>
        ) : (
          <Container className="gridbox">
            <Row className="gridrow">
              {rides.map((ride) => (
                <div className="ride-card" key={ride.ride_id}>
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

                   {/* <div className="line" style={{backgroundColor: 'black' }}> </div>

                   <h2 id="type">pickup otp: {ride.ride_otp}</h2>
                   <h2 id="type">drop otp: {ride.drop_otp}</h2> */}

                   {/* <input type="button" value='cancelled' className="ride-join" disabled/> */}
                </div>     
              ))}
            </Row>
          </Container>
        )}
      </div>
    </>
  );
};

export default CancelledUserRides;
