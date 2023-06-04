import React, { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import './component-styles/ridesearch.css';
import { db } from '../firebaseConfig';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { UserAuth } from '../context/UserAuthContext';

const CompletedRides = () => {
  const authContext = UserAuth();
  const currentUserUid = authContext.user ? authContext.user.uid : null;

  const [rides, setRides] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [ridesPostedExists, setRidesPostedExists] = useState(true);

  useEffect(() => {
    const fetchCompletedRides = async () => {
      try {
        const ridesCollectionRef = collection(db, 'users', currentUserUid, 'ridesposted');
        const ridesSnapshot = await getDocs(ridesCollectionRef);

        if (ridesSnapshot.empty) {
          setRidesPostedExists(false);
        } else {
          const q = query(ridesCollectionRef, where('ride_status', '==', 'complete'));
          const completedRidesSnapshot = await getDocs(q);
          const completedRidesData = completedRidesSnapshot.docs.map((doc) => doc.data());
          setRides(completedRidesData);
        }

        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching completed rides:', error);
      }
    };

    fetchCompletedRides();
  }, [currentUserUid]);

  if (isLoading) {
    return <p>Loading completed rides...</p>;
  }

  return (
    <>
      <div className="ride-results">
        <div className="ride-head">
          <h2>Completed Rides</h2>
        </div>
      </div>

      <div className="card-results">
        {!ridesPostedExists ? (
          <p>No rides posted yet.</p>
        ) : rides.length === 0 ? (
          <p>No completed rides currently.</p>
        ) : (
          <Container className="gridbox">
            <Row className="text-center gridrow">
              {rides.map((ride, index) => (
                <div className="ride-card" key={index}>
                  <h2 id="loc">
                    {ride.start_loc} to {ride.end_loc}
                  </h2>
                  <h2 className="type">Vehicle type</h2>
                  <h2 id="name">{ride.ride_otp}</h2>
                  <h2 className="type">Vehicle type</h2>
                  <h3 id="type">{ride.vehicle_type}</h3>
                  <h2 className="type">Vehicle No</h2>
                  <h3 id="type">{ride.vehicle_number}</h3>
                  <h2 id="seat">Seats Available {ride.seats}</h2>
                  <h5 id="cost">Cost Per Km</h5>
                  <h2 id="realcost">{ride.cost_per_km}</h2>
                  <input type="button" value={ride.ride_otp} className="ride-join" disabled/>
                </div>
              ))}
            </Row>
          </Container>
        )}
      </div>
    </>
  );
};

export default CompletedRides;