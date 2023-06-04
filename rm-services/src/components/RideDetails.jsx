import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../firebaseConfig';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';

const RideDetails = () => {
  const { ride_id } = useParams(); // Get the rideId parameter from the URL
//   const [ride, setRide] = useState(null);
//   const [usersJoined, setUsersJoined] = useState([]);
console.log(ride_id)
//   useEffect(() => {
//     const fetchRideDetails = async () => {
//       try {
//         const rideRef = doc(db, 'rides', rideId);
//         const rideDoc = await getDoc(rideRef);
        
//         if (rideDoc.exists()) {
//           const rideData = rideDoc.data();
//           setRide(rideData);
          
//           // Fetch users who joined the ride
//           const usersJoinedRef = collection(db, 'rides', rideId, 'usersJoined');
//           const usersJoinedSnapshot = await getDocs(usersJoinedRef);
//           const usersJoinedData = usersJoinedSnapshot.docs.map((doc) => doc.data());
//           setUsersJoined(usersJoinedData);
//         } else {
//           console.log('Ride not found');
//         }
//       } catch (error) {
//         console.error('Error fetching ride details:', error);
//       }
//     };

//     fetchRideDetails();
//   }, [rideId]);

//   if (!ride) {
//     return <p>Loading ride details...</p>;
//   }

  return (
    <div>
      <h2>Ride Details</h2>
      {/* <h3>{ride.start_loc} to {ride.end_loc}</h3> */}
      {/* Display other ride details */}
      
      <h2>Users Joined</h2>
      {/* {usersJoined.length === 0 ? (
        <p>No users have joined this ride yet.</p>
      ) : (
        <ul>
          {usersJoined.map((user) => (
            <li key={user.user_id}>{user.username}</li>
          ))}
        </ul>
      )} */}
    </div>
  );
};

export default RideDetails;
