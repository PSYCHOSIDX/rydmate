// import React, { useEffect, useState } from 'react';
// import Container from 'react-bootstrap/Container';
// import Row from 'react-bootstrap/Row';
// import './component-styles/ridesearch.css';
// import { db } from '../firebaseConfig';
// import { collection, getDocs, query, where } from 'firebase/firestore';
// import { UserAuth } from '../context/UserAuthContext';
// import { Link } from 'react-router-dom';

// const UsersRides = () => {
//   const authContext = UserAuth();
//   const currentUserUid = authContext.user && authContext.user.uid;

//   const [rides, setRides] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [ridesJoinedExists, setRidesJoinedExists] = useState(true);

//   useEffect(() => {
//     const fetchRides = async () => {
//       try {
//         if (!currentUserUid) {
//           setIsLoading(false);
//           return;
//         }

//         const ridesRef = collection(db, 'rides');
//         const q = query(
//           ridesRef,
//           where('5DsX5C1MgFaVN2cqalAF.UsersJoined.' + currentUserUid + '.carpool_status', '==', 'accepted')
//         );

//         console.log(currentUserUid)
//         const querySnapshot = await getDocs(q);

//         // if (querySnapshot.empty) {
//           // console.log('empty')
//           // setRidesJoinedExists(false);
//         // } else {
//           const ridesData = querySnapshot.docs.map((doc) => doc.data());
//           setRides(ridesData);
//           console.log(ridesData)
//         // }
//         setIsLoading(false);
//       } catch (error) {
//         console.error('Error fetching accepted rides:', error);
//       }
//     };

//     fetchRides();
//   }, [currentUserUid]);

//   if (isLoading) {
//     return <p>Loading rides...</p>;
//   }

//   return (
//     <>
//       <div className="ride-results">
//         <div className="ride-head">
//           {/* <h2>Active Rides</h2> */}
//         </div>
//       </div>

//       <div className="card-results">
//         {/* {!ridesJoinedExists ? (
//           <h2>
//             No rides joined yet.{' '}
//             <Link to="/rides" className="link">
//               Join your first carpool
//             </Link>
//           </h2>
//         ) : ( */}
//           <Container className="gridbox">
//             <Row className="gridrow">
//               {rides.map((ride) => (
//                 <div className="ride-card" key={ride.ride_id}>
//                   <h2 id="loc">
//                     {ride.start_loc} to {ride.end_loc}
//                   </h2>
//                   <div className="line">.</div>

//                   <h2 className="type">Vehicle name</h2>
//                   <h2 id="type">{ride.vehicle_name}</h2>
//                   <h2 className="type">Vehicle type</h2>
//                   <h3 id="type">{ride.vehicle_type}</h3>
//                   <h2 className="type">Vehicle No</h2>
//                   <h3 id="type">{ride.vehicle_number}</h3>
//                   <h2 className="type">Departure Time</h2>
//                   <h3 id="type">{ride.departure_time}</h3>
//                   <h2 id="type">Status: {ride.ride_status}</h2>
//                   {/* <h5 id="cost">Cost Per Km</h5> */}
//                   {/* <h2 id="realcost">{ride.cost_per_km}</h2> */}
//                   <input type="button" value="Chat" className="ride-join" />
//                 </div>
//               ))}
//             </Row>
//           </Container>
//         {/* )} */}
//       </div>
//     </>
//   );
// };

// export default UsersRides;







import React, { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import './component-styles/ridesearch.css';
import { db } from '../firebaseConfig';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { UserAuth } from '../context/UserAuthContext';

const UsersRides = () => {
  const authContext = UserAuth();
  const currentUserUid = authContext.user && authContext.user.uid;
  
  const [rides, setRides] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRides = async () => {
      try {
        const carpoolsJoinedRef = collection(db,'users', currentUserUid, 'CarpoolsJoined');
        const querySnapshot = await getDocs(carpoolsJoinedRef);

        const rideIds = querySnapshot.docs.map((doc) => doc.data().ride_id);
        const ridesRef = collection(db, 'rides');
        const q = query(ridesRef, where('ride_id', 'in', rideIds));
        const ridesSnapshot = await getDocs(q);

        const ridesData = ridesSnapshot.docs.map((doc) => doc.data());
        console.log('Rides data:', ridesData);
        setRides(ridesData);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching rides:', error);
      }
    };

    fetchRides();
  }, []);

  if (isLoading) {
    return <p>Loading rides...</p>;
  }

  return (
    <>
      <div className="ride-results">
        <div className="ride-head">
          {/* <h2>Active Rides</h2> */}
        </div>
      </div>

      <div className="card-results">
        {rides.length === 0 ? (
          <h2>
            No rides with usersjoined subcollection found.{' '}
            <Link to="/rides" className="link">
              Request a ride
            </Link>
          </h2>
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
                   <h2 className="type">Ride Status</h2>
                   <h3 id="type">{ride.ride_status}</h3>
                   {/* <h5 id="cost">Cost Per Km</h5> */}
                   {/* <h2 id="realcost">{ride.cost_per_km}</h2> */}

                   <div className="line" style={{backgroundColor: 'black' }}> </div>

                   <h2 id="type">pickup otp: {ride.ride_otp}</h2>
                   <h2 id="type">drop otp: {ride.drop_otp}</h2>

                   <input type="button" value="Chat" className="ride-join" />
                </div>
              ))}
            </Row>
          </Container>
        )}
      </div>
    </>
  );
};

export default UsersRides;
