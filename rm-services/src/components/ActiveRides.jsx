import React, { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import './component-styles/ridesearch.css';
import { db } from '../firebaseConfig';
import { doc, collection, getDocs, query, where ,updateDoc} from 'firebase/firestore';
import { UserAuth } from '../context/UserAuthContext';
import { Link } from 'react-router-dom';

import { FaBell } from 'react-icons/fa';
import moment from 'moment';

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
    // ...

    const fetchRidesPendingStatus = async () => {
      const ridesPendingStatusMap = {};

      for (const ride of rides) {
        const isPending = await checkPendingStatus(ride.ride_id);
        ridesPendingStatusMap[ride.ride_id] = isPending;
      }

      setRidesPendingStatus(ridesPendingStatusMap);
    };

    fetchRidesPendingStatus();
  }, [rides]);

  
  const calculateTimeLeft = (departureTime, ride_id) => {
    const now = moment();
    const departure = moment(departureTime);
    const duration = moment.duration(departure.diff(now));
  
    const days = Math.floor(duration.asDays());
  
    if (days <= -2) {
      try {
        const rideRef = doc(db, 'rides', ride_id);
        updateDoc(rideRef, { ride_status: 'cancelled' }).then(() => {
          console.log('cancelled', ride_id);
          window.location.href = '/activerides';
        });
      } catch (error) {
        console.error('Error cancelling ride:', error);
      }
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
          <h2>No active rides currently.
            <Link to="/postride" className='link'>
           Post your first ride 
          </Link></h2>
        ) : (
          <Container className="gridbox">
            <Row className="gridrow">
              {rides.map((ride, index) => {
                const timeLeft = calculateTimeLeft(ride.departure_time, ride.ride_id);
                const countdown = `${timeLeft.days}${timeLeft.hours}h ${timeLeft.minutes}m`;

                return (
               <Link to={`/activerides/${ride.ride_id}`} key={ride.ride_id} style={{
                textDecoration: 'none',
                color: 'inherit',
                flexBasis: '33.33%',
                padding: '4px',
                boxSizing: 'border-box',
                // display: index < 3 ? 'inline-block' : 'none',
              }}>
               <div className="ride-card">
               <span className="countdown" id='realcost'>
    {countdown}
  </span>

               {ridesPendingStatus[ride.ride_id] && (
                <FaBell className="notification-icon" style={{ color: 'yellow', marginLeft: '50%', fontSize: '30px' }} />
              )}
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
                  {/* <input type="button" value={ride.ride_otp} className="ride-join" disabled/> */}
                  </div>
      </Link>
             );
                })}
            </Row>
          </Container>
        )}
      </div>
    </>
  );
};

export default ActiveRides;
