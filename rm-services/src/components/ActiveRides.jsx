import React, { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import './component-styles/ridesearch.css';
import { db } from '../firebaseConfig';
import { doc, collection, getDoc, setDoc, getDocs, query, where, updateDoc } from 'firebase/firestore';
import { UserAuth } from '../context/UserAuthContext';
import { Link } from 'react-router-dom';

import { FaBell } from 'react-icons/fa';
import moment from 'moment';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ActiveRides = () => {
  const authContext = UserAuth();
  const currentUserUid = authContext.user && authContext.user.uid;

  const [rides, setRides] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [ridesPostedExists, setRidesPostedExists] = useState(true);

  const [ridesPendingStatus, setRidesPendingStatus] = useState({});

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
          const q = query(
            ridesCollectionRef,
            where('user_id', '==', currentUserUid),
            where('ride_status', '==', 'active')
          );
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

  const checkPendingStatus = async (rideId) => {
    try {
      const userJoinedCollectionRef = collection(db, 'rides', rideId, 'UsersJoined');
      const querySnapshot = await getDocs(query(userJoinedCollectionRef, where('carpool_status', '==', 'pending')));
      return querySnapshot.size > 0; // Returns true if there are any documents with 'pending' status in the subcollection
    } catch (error) {
      console.error('Error checking pending status:', error);
      return false;
    }
  };

  useEffect(() => {
    const fetchRidesPendingStatus = async () => {
      const ridesPendingStatusMap = {};

      for (const ride of rides) {
        const isPending = await checkPendingStatus(ride.ride_id);
        ridesPendingStatusMap[ride.ride_id] = isPending;
      }

      setRidesPendingStatus(ridesPendingStatusMap);
    };

    const updateUserRequestStatus = async () => {
      try {
        const userRef = doc(db, 'users', currentUserUid, 'details', currentUserUid);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          const { request_received, user_ride } = userData;

          if (request_received && user_ride) {
            const rideRef = doc(db, 'rides', user_ride);
            const rideDoc = await getDoc(rideRef);
            const rideData = rideDoc.data();

            toast.success(`You received a new request for the ride from ${rideData.start_loc} to ${rideData.end_loc}!`);
          }

          await updateDoc(userRef, { request_received: false, user_ride: '' });
        }
      } catch (error) {
        console.error('Error updating user request status:', error);
      }
    };

    fetchRidesPendingStatus();
    updateUserRequestStatus();
  }, [rides, currentUserUid]);

  const calculateTimeLeft = (departureTime, ride_id) => {
    const now = moment();
    const departure = moment(departureTime);
    const duration = moment.duration(departure.diff(now));

    const days = Math.floor(duration.asDays());

    if (days <= -2) {
      const rideRef = doc(db, 'rides', ride_id);
      updateDoc(rideRef, { ride_status: 'cancelled' })
        .then(async () => {
          console.log('cancelled', ride_id);

          const usersJoinedRef = collection(db, 'rides', ride_id, 'UsersJoined');
          const usersJoinedSnapshot = await getDocs(usersJoinedRef);

         // Update the ridecancelled field for each user document in the users collection
const updatePromises = usersJoinedSnapshot.docs.map(async (userDoc) => {
  const carpoolStatus = userDoc.data().carpool_status;
  const userDocRef = doc(db, 'users', userDoc.data().user_id, 'details', userDoc.data().user_id);
  const userDocSnapshot = await getDoc(userDocRef);

  if (userDocSnapshot.exists()) {
    if (carpoolStatus === 'pending' || carpoolStatus === 'accepted') {
      return updateDoc(userDocRef, { request_ride_cancelled: true, cancelled_ride_id: ride_id });
    }
  } else {
    if (carpoolStatus === 'pending' || carpoolStatus === 'accepted') {
      return setDoc(userDocRef, { request_ride_cancelled: true, cancelled_ride_id: ride_id });
    }
  }
});

await Promise.all(updatePromises);

          window.location.href = '/activerides';
        })
        .catch((error) => {
          console.error('Error cancelling ride:', error);
        });
    }

    let hours = Math.floor(duration.asHours()) % 24;
    let minutes = Math.floor(duration.asMinutes()) % 60;

    if (hours < 0) hours = 0;
    if (minutes < 0) minutes = 0;

    const formattedDays = days > 0 ? `${days}d ` : '0d ';
    const formattedHours = hours.toString().padStart(2, '0');
    const formattedMinutes = minutes.toString().padStart(2, '0');

    return {
      days: formattedDays,
      hours: formattedHours,
      minutes: formattedMinutes,
    };
  };

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
          <h2>
            No active rides currently.
            <Link to="/postride" className="link">
              Post your first ride
            </Link>
          </h2>
        ) : (
          <Container className="gridbox">
            <Row className="gridrow">
              {rides.map((ride, index) => {
                const timeLeft = calculateTimeLeft(ride.departure_time, ride.ride_id);
                const countdown = `${timeLeft.days}${timeLeft.hours}h ${timeLeft.minutes}m`;

                return (
                  <Link
                    to={`/activerides/${ride.ride_id}`}
                    key={ride.ride_id}
                    style={{
                      textDecoration: 'none',
                      color: 'inherit',
                      flexBasis: '33.33%',
                      padding: '4px',
                      boxSizing: 'border-box',
                    }}
                  >
                    <div className="ride-card">
                      <span className="countdown" id="realcost">
                        {countdown}
                      </span>

                      {ridesPendingStatus[ride.ride_id] && (
                        <FaBell
                          className="notification-icon"
                          style={{ color: 'yellow', marginLeft: '50%', fontSize: '30px' }}
                        />
                      )}
                      <h2 id="loc">
                        <b>FROM</b> {ride.start_loc} <br /> <b>TO</b> {ride.end_loc}
                      </h2>

                      <div className="line"> </div>
                      <br />
                      <h2 className="type">Vehicle type </h2>
                      <h3 id="type">{ride.vehicle_type}</h3>
                      <h2 className="type">Vehicle No </h2>
                      <h3 id="type">{ride.vehicle_number}</h3>

                      <h2 className="type">Vehicle Model </h2>
                      <h3 id="type">{ride.vehicle_name}</h3>

                      <h5 id="cost">Departure Time</h5>
                      <h2 id="realcost">{ride.departure_time.substring(0, 35).replace('T', ' ')}</h2>
                    </div>
                  </Link>
                );
              })}
            </Row>
          </Container>
        )}
      </div>
      <ToastContainer />
    </>
  );
};

export default ActiveRides;
