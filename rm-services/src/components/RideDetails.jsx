import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../firebaseConfig';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { Container, Row } from 'react-bootstrap';

const RideDetails = () => {
  const { ride_id } = useParams();
  const [ride, setRide] = useState(null);
  const [usersJoined, setUsersJoined] = useState([]);

  useEffect(() => {
    const fetchRideDetails = async () => {
      try {
        const rideRef = doc(db, 'rides', ride_id);
        const rideDoc = await getDoc(rideRef);

        if (rideDoc.exists()) {
          const rideData = rideDoc.data();
          setRide(rideData);

          // Fetch users who joined the ride
          const usersJoinedRef = collection(db, 'rides', ride_id, 'usersJoined');
          const usersJoinedSnapshot = await getDocs(usersJoinedRef);
          const usersJoinedData = usersJoinedSnapshot.docs.map((doc) => doc.data());
          setUsersJoined(usersJoinedData);
        } else {
          console.log('Ride not found');
        }
      } catch (error) {
        console.error('Error fetching ride details:', error);
      }
    };

    fetchRideDetails();
  }, [ride_id]);

  if (!ride) {
    return <p>Loading ride details...</p>;
  }

  return (
    <div>
      <h2>Ride Details</h2>
      <h3>{ride.start_loc} to {ride.end_loc}</h3>

      <h2>Users Joined</h2>
      <div className="card-results">
        {usersJoined.length === 0 ? (
          <p>No users have joined this ride yet.</p>
        ) : (
          <Container className="gridbox">
            <Row className="gridrow">
              {usersJoined.map((user) => (
                <div className="ride-card" key={user.user_id}>
                  <h2 id="loc">
                    {user.start_loc} to {user.end_loc}
                  </h2>

                  <h2 className="type">User name</h2>
                  <h2 id="type">{user.name}</h2>
                  <h2 className="type">Seats requested</h2>
                  <h3 id="type">{ride.seats}</h3>

                  <input type="button" value='accept' className="ride-join" disabled />
                  <input type="button" value='reject' className="ride-join" disabled />
                </div>
              ))}
            </Row>
          </Container>
        )}
      </div>
    </div>
  );
};

export default RideDetails;
