import React, { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import './component-styles/ridesearch.css';
import { db } from '../firebaseConfig';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { UserAuth } from '../context/UserAuthContext';
import { Link } from 'react-router-dom';

const ActiveRides = () => {
  const authContext = UserAuth();
  const currentUserUid = authContext.user && authContext.user.uid;

  const [rides, setRides] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [ridesPostedExists, setRidesPostedExists] = useState(true);

  useEffect(() => {
    const fetchActiveRides = async () => {
      try {
        if (!currentUserUid) {
          setIsLoading(false);
          return;
        }

        const ridesCollectionRef = collection(db, 'rides');
        const ridesSnapshot = await getDocs(ridesCollectionRef);

        if (ridesSnapshot.empty) {
          setRidesPostedExists(false);
        } else {
          const q = query(ridesCollectionRef, where('user_id', '==', currentUserUid), where('ride_status', '==', 'active'));
          const activeRidesSnapshot = await getDocs(q);
          const activeRidesData = activeRidesSnapshot.docs.map((doc) => doc.data());
          setRides(activeRidesData);
        }

        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching active rides:', error);
      }
    };

    fetchActiveRides();
  }, [currentUserUid]);

  if (isLoading) {
    return <p>Loading active rides...</p>;
  }

  return (
    <>
      <div className="ride-results">
        <div className="ride-head">
          <h2>Active Rides</h2>
        </div>
      </div>

      <div className="card-results">
        {!ridesPostedExists ? (
          <p>No rides posted yet.</p>
        ) : rides.length === 0 ? (
          <h2>No active rides currently.
            <Link to="/postride" className='link'>
           Post your first ride 
          </Link></h2>
        ) : (
          <Container className="gridbox">
            <Row className="gridrow">
              {rides.map((ride,index) => (
               <Link to={`/activerides/${ride.ride_id}`} key={ride.ride_id} style={{
                textDecoration: 'none',
                color: 'inherit',
                flexBasis: '33.33%',
                padding: '4px',
                boxSizing: 'border-box',
                display: index < 3 ? 'inline-block' : 'none',
              }}>
               <div className="ride-card">
               <h2 id="loc"><b>FROM</b> {ride.start_loc} <br/> <b>TO</b> {ride.end_loc}</h2>
              
                  <div className="line"> </div>
                  <br/>
                  <h2 className='type'>Vehicle type </h2>
      <h3 id='type'>{ride.vehicle_type}</h3>
      <h2 className='type'>Vehicle No </h2>
      <h3 id='type'>{ride.vehicle_number}</h3>

      <h2 className='type'>Vehicle Model </h2>
      <h3 id='type'>{ride.vehicle_name}</h3>


      <h5 id='cost'>Departure Time</h5>
      <h2 id='realcost'>{ride.departure_time.substring(0,35).replace('T',' ')}</h2>

                  {/* <h2 id="seat">Seats Available {ride.seats}</h2>
                  <h5 id="cost">Cost Per Km</h5>
                  <h2 id="realcost">{ride.cost_per_km}</h2> */}
                  <input type="button" value={ride.ride_otp} className="ride-join" disabled/>
                  </div>
      </Link>
              ))}
            </Row>
          </Container>
        )}
      </div>
    </>
  );
};

export default ActiveRides;
