import React, { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import './component-styles/ridesearch.css';
import { db } from '../firebaseConfig';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { UserAuth } from '../context/UserAuthContext';
import { Link } from 'react-router-dom';

const UsersRides = () => {
  const authContext = UserAuth();
  const currentUserUid = authContext.user && authContext.user.uid;

  // const [rides, setRides] = useState([]);
  // const [isLoading, setIsLoading] = useState(true);
  // const [ridesJoinedExists, setRidesPostedExists] = useState(true);

  // useEffect(() => {
  //   const fetchRides = async () => {
  //     try {
  //       if (!currentUserUid) {
  //         setIsLoading(false);
  //         return;
  //       }

  //       const ridesCollectionRef = collection(db, 'users', currentUserUid, 'ridesjoined');
  //       const ridesSnapshot = await getDocs(ridesCollectionRef);

  //       if (ridesSnapshot.empty) {
  //         setRidesPostedExists(false);
  //       } else {
  //         const q = query(ridesCollectionRef, where('ride_status', '==', 'active'));
  //         const activeRidesSnapshot = await getDocs(q);
  //         const activeRidesData = activeRidesSnapshot.docs.map((doc) => doc.data());
  //         setRides(activeRidesData);
  //       }

  //       setIsLoading(false);
  //     } catch (error) {
  //       console.error('Error fetching active rides:', error);
  //     }
  //   };

  //   fetchRides();
  // }, [currentUserUid]);

  // if (isLoading) {
  //   return <p>Loading active rides...</p>;
  // }

  return (
    <>
      <div className="ride-results">
        <div className="ride-head">
          <h2>Active Rides</h2>
        </div>
      </div>

      <div className="card-results">
        {/* {!ridesJoinedExists ? (
          <h2>No rides joined yet. <Link to="/rides" className='link'>
           Join your first carpool
          </Link></h2>
        )
            
         : ( */}
          <Container className="gridbox">
            <Row className="gridrow">
              {/* {rides.map((ride) => (
               <Link to={`/activerides/${ride.ride_id}`} key={ride.ride_id}> */}
               <div className="ride-card">
                  <h2 id="loc">
                    {'ride.start_loc'} to {'ride.end_loc'}
                  </h2>
                  <div className="line"> .</div>

                  <h2 className="type">Vehicle name</h2>
                  <h2 id="type">{'ride.vehicle_name'}</h2>
                  <h2 className="type">Vehicle type</h2>
                  <h3 id="type">{'ride.vehicle_type'}</h3>
                  <h2 className="type">Vehicle No</h2>
                  <h3 id="type">{'ride.vehicle_number'}</h3>
                   <h2 id="type"> status {'ride.ride_status'}</h2>
                  {/* <h5 id="cost">Cost Per Km</h5> */}
                 {/* <h2 id="realcost">{ride.cost_per_km}</h2> */}
                  {/* <input type="button" value={ride.ride_otp} className="ride-join" disabled/> */}
                  </div>
      {/* </Link>
              ))} */}
            </Row>
          </Container>
        {/* )} */}
      </div>
    </>
  );
};

export default UsersRides;
