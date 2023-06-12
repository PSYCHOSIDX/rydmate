import React, { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import './component-styles/ridesearch.css';
import { db } from '../firebaseConfig';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { UserAuth } from '../context/UserAuthContext';
import { Link } from 'react-router-dom';

const CancelledRides = () => {
  const authContext = UserAuth();
  const currentUserUid = authContext.user && authContext.user.uid;

  const [rides, setRides] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [ridesPostedExists, setRidesPostedExists] = useState(true);

  useEffect(() => {
    const fetchCancelledRides = async () => {
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
          const q = query(ridesCollectionRef, where('user_id', '==', currentUserUid), where('ride_status', '==', 'cancelled'));
          const cancelledRidesSnapshot = await getDocs(q);
          const cancelledRidesData = cancelledRidesSnapshot.docs.map((doc) => doc.data());
          setRides(cancelledRidesData);
        }

        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching cancelled rides:', error);
      }
    };

    fetchCancelledRides();
  }, [currentUserUid]);

  if (isLoading) {
    return <p>Loading cancelled rides...</p>;
  }

  return (
    <>
      <div className="ride-results">
        <div className="ride-head">
          <h2>Cancelled Rides</h2>
        </div>
      </div>

      <div className="card-results">
        {!ridesPostedExists ? (
        <h2>No active rides currently.
        <Link to="/postride" className='link'>
       Post your first ride 
      </Link></h2>
        ) : rides.length === 0 ? (
          <p>No cancelled rides yet.</p>
        ) : (
          <Container className="gridbox">
            <Row className="gridrow">
              {rides.map((ride) => (
                <div className="ride-card" key={ride.ride_id}>
             <h2 id="loc"><b>FROM</b> {ride.start_loc} <br/> <b>TO</b> {ride.end_loc}</h2>
              
              <div className="line"> </div>
              <br/>
              <h2 className='type'>Vehicle type </h2>
  <h3 id='type'>{ride.vehicle_type}</h3>
  <h2 className='type'>Vehicle No </h2>
  <h3 id='type'>{ride.vehicle_number}</h3>

  <h2 className='type'>Vehicle Model </h2>
  <h3 id='type'>{ride.vehicle_name}</h3>
                  {/* <h2 id="seat">Seats Available {ride.seats}</h2>
                  <h5 id="cost">Cost Per Km</h5>
                  <h2 id="realcost">{ride.cost_per_km}</h2> */}
                  <input type="button" value={ride.ride_otp} className="ride-join" disabled />
                </div>
              ))}
            </Row>
          </Container>
        )}
      </div>
    </>
  );
};

export default CancelledRides;
