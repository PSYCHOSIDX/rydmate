// import React, { useEffect, useState, useRef } from 'react';
// import { useParams } from 'react-router-dom';
// import { db } from '../firebaseConfig';
// import { collection, doc, getDoc, getDocs, setDoc, updateDoc } from 'firebase/firestore';
// import { Container, Row, Modal, Button, Tab, Tabs } from 'react-bootstrap';

// const RideDetails = () => {
//   const { ride_id } = useParams();
//   const [ride, setRide] = useState(null);
//   const [usersJoined, setUsersJoined] = useState([]);
//   const [acceptedUsers, setAcceptedUsers] = useState([]);
//   const [pendingUsers, setPendingUsers] = useState([]);
//   const [showModal, setShowModal] = useState(false);
//   const [modalMessage, setModalMessage] = useState('');
//   const [pickedUpUsers, setPickedUpUsers] = useState([]);
//   const otpRef = useRef(null);
//   const [showOtpDialog, setShowOtpDialog] = useState(false); // Add state variable for OTP dialog

//   useEffect(() => {
//     const fetchRideDetails = async () => {
//       try {
//         const rideRef = doc(db, 'rides', ride_id);
//         const rideDoc = await getDoc(rideRef);

//         if (rideDoc.exists()) {
//           const rideData = rideDoc.data();
//           setRide(rideData);

//           // Fetch users who joined the ride
//           const usersJoinedRef = collection(db, 'rides', ride_id, 'UsersJoined');
//           const usersJoinedSnapshot = await getDocs(usersJoinedRef);
//           const usersJoinedData = usersJoinedSnapshot.docs.map((doc) => doc.data());
//           setUsersJoined(usersJoinedData);

//           // Filter and set the accepted users
//           const acceptedUsersData = usersJoinedData.filter(
//             (user) => user.carpool_status === 'accepted'
//           );
//           setAcceptedUsers(acceptedUsersData);

//           // Filter and set the pending users
//           const pendingUsersData = usersJoinedData.filter(
//             (user) => user.carpool_status === 'pending'
//           );
//           setPendingUsers(pendingUsersData);
//         } else {
//           console.log('Ride not found');
//         }
//       } catch (error) {
//         console.error('Error fetching ride details:', error);
//       }
//     };

//     fetchRideDetails();
//   }, [ride_id]);

//   const handleAccept = async (userId, seats) => {
//     try {
//       if (ride.seats === 0) {
//         setModalMessage('Vehicle capacity is full');
//         setShowModal(true);
//         return;
//       }

//       const remainingSeats = ride.seats - seats;

//       if (remainingSeats < 0) {
//         setModalMessage('Not enough seats available');
//         setShowModal(true);
//         return;
//       }

//       // Update carpool_status to accepted for the selected user
//       const userRef = doc(db, 'rides', ride_id, 'UsersJoined', userId);
//       await updateDoc(userRef, { carpool_status: 'accepted' });

//       // Update seats in the rides collection
//       const rideRef = doc(db, 'rides', ride_id);
//       await updateDoc(rideRef, { seats: remainingSeats });


//           // Create a document in the carpoolsjoined subcollection for the accepted user
//     const carpoolsJoinedRef = doc(db, 'users', userId, 'CarpoolsJoined', ride_id);
//     await setDoc(carpoolsJoinedRef, {
//       ride_id,
//       ride_otp: ride.ride_otp,
//       drop_otp: ride.drop_otp,
//       carpool_status : 'pick up',
//     });


//       // Navigate to the home page
//       window.location.href = '/';
//     } catch (error) {
//       console.error('Error accepting ride:', error);
//     }
//   };

//   const handleReject = async (userId) => {
//     try {
//       // Update carpool_status to rejected for the selected user
//       const userRef = doc(db, 'rides', ride_id, 'UsersJoined', userId);
//       await updateDoc(userRef, { carpool_status: 'rejected' });

//       // Navigate to the home page
//       window.location.href = '/';
//     } catch (error) {
//       console.error('Error rejecting ride:', error);
//     }
//   };

//   const handleCancelRide = async () => {
//     try {
//       // Update the status of the ride to "cancelled"
//       const rideRef = doc(db, 'rides', ride_id);
//       await updateDoc(rideRef, { ride_status: 'cancelled' });

//       // Navigate to the home page
//       window.location.href = '/';
//     } catch (error) {
//       console.error('Error cancelling ride:', error);
//     }
//   };


//   const handlePickup = (userId, rideOtp) => {
//     setShowOtpDialog(true); // Show OTP dialog
//   };

//   const handleVerifyOtp = async (userId) => {
//     const otpInput = otpRef.current.value;
  
//     try {
//       const rideRef = doc(db, 'rides', ride_id);
//       const rideDoc = await getDoc(rideRef);
  
//       if (rideDoc.exists()) {
//         const rideData = rideDoc.data();
//         const rideOtp = Number(rideData.ride_otp);

//         if (rideOtp === Number(otpInput)) {
//           // OTP verified successfully
//           setShowOtpDialog(false); // Close OTP dialog
//           const updatedAcceptedUsers = acceptedUsers.map((user) => {
//             if (user.user_id === userId) {
//               return { ...user, showOtpDialog: false };
//             }
//             return user;
//           });
  
//           setAcceptedUsers(updatedAcceptedUsers);
  
//           if (updatedAcceptedUsers.every((user) => user.user_id !== userId || !user.showOtpDialog)) {
//             setPickedUpUsers([...pickedUpUsers, userId]);
//           }
//         } else {
//           setModalMessage('Invalid OTP');
//           setShowModal(true);
//         }
//       } else {
//         console.log('Ride not found');
//       }
//     } catch (error) {
//       console.error('Error fetching ride details:', error);
//     }
//   };


//   if (!ride) {
//     return <p>Loading ride details...</p>;
//   }

//   return (
//     <div>
//       <div className="ride-results">
//         <div className="ride-head">
//           <h3 style={{ textAlign: 'center', color: 'white' }}>
//             {ride.start_loc} to {ride.end_loc}
//           </h3>
//           <Button
//             style={{ textAlign: 'right', color: 'white', backgroundColor: 'green' }}
//             onClick={handleCancelRide}
//           >
//             Cancel Ride
//           </Button>
//         </div>
//       </div>

//       <Tabs defaultActiveKey="accepted"
//       id="users-tabs"
//       style={{ backgroundColor: '#f5f5f5', padding: '10px' }}
//       variant="pills"
//       className="custom-tabs">
//         <Tab eventKey="accepted" title={<span style={{ fontWeight: 'bold'}}>Accepted Users</span>}>
//         <div className="card-results">
//           {acceptedUsers.length === 0 ? (
//             <p>No users have been accepted for this ride yet.</p>
//           ) : (
//             <Container className="gridbox">
//               <Row className="gridrow">
//                 {acceptedUsers.map((user) => (
//                   <div className="ride-card" key={user.user_id}>
//                     <h2 id="loc">start location</h2>
//                     <h2 id="type">{user.start_loc}</h2> 
//                     <Button
//                         style={{ color: 'white', backgroundColor: 'green' }}
//                         onClick={() => handlePickup(user.user_id, user.ride_otp)}
//                       >
//                         {pickedUpUsers.includes(user.user_id) ? 'Picked Up' : 'Pick Up'}
//                       </Button>                    
//                       <h2 id="loc">end location</h2>
//                     <h2 id="type">{user.end_loc}</h2> 
//                     <Button style={{ color: 'white', backgroundColor: 'green' }}>drop off</Button>

//                     <h2 className="type">User name</h2>
//                     <h2 id="type">{user.user_name}</h2>
//                     <h2 className="type">Seats requested</h2>
//                     <h3 id="type">{user.seats}</h3>

//                     <input type="button" value="Chat" className="ride-join" />


//                     {showOtpDialog && ( // Display OTP dialog if showOtpDialog is true
//         <Modal show={true} onHide={() => setShowOtpDialog(false)}> {/* Update onHide prop */}
//         <Modal.Header closeButton>
//             <Modal.Title>Enter OTP</Modal.Title>
//           </Modal.Header>
//           <Modal.Body>
//             <input type="text" placeholder="Enter OTP" ref={otpRef} />
//           </Modal.Body>
//           <Modal.Footer>
//             <Button variant="secondary" onClick={() => handleVerifyOtp(user.user_id)}>
//               Verify OTP
//             </Button>
//           </Modal.Footer>
//         </Modal>
//                       )}
//                   </div>
//                 ))}
                
//               </Row>
//             </Container>
//           )}
       
//        </div> </Tab>
//         <Tab eventKey="pending" title={<span style={{ fontWeight: 'bold'}}>Pending Users</span>}>
//         <div className="card-results">
//           {pendingUsers.length === 0 ? (
//             <p>No users have joined this ride yet.</p>
//           ) : (
//             <Container className="gridbox">
//               <Row className="gridrow">
//                 {pendingUsers.map((user) => (
//                   <div className="ride-card" key={user.user_id}>
//                     <h2 id="loc">start location</h2>
//                     <h2 id="type">{user.start_loc}</h2>
//                     <h2 id="loc">end location</h2>
//                     <h2 id="type">{user.end_loc}</h2>

//                     <h2 className="type">User name</h2>
//                     <h2 id="type">{user.user_name}</h2>
//                     <h2 className="type">Seats requested</h2>
//                     <h3 id="type">{user.seats}</h3>

//                     <input
//                       type="button"
//                       value="Accept"
//                       className="ride-join"
//                       onClick={() => handleAccept(user.user_id, user.seats)}
//                     />
//                     <br />
//                     <br />
//                     <input
//                       type="button"
//                       value="Reject"
//                       className="ride-join"
//                       onClick={() => handleReject(user.user_id)}
//                     />
//                   </div>
//                 ))}
//               </Row>
//             </Container>
//           )}
//        </div> </Tab>
//       </Tabs>

//       {/* Modal */}
//       <Modal show={showModal} onHide={() => setShowModal(false)}>
//         <Modal.Header closeButton>
//           <Modal.Title>Message</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>{modalMessage}</Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => setShowModal(false)}>
//             Close
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </div>
//   );
// };

// export default RideDetails;





import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../firebaseConfig';
import { collection, doc, getDoc, getDocs, setDoc, updateDoc } from 'firebase/firestore';
import { Container, Row, Modal, Button, Tab, Tabs } from 'react-bootstrap';

const RideDetails = () => {
  const { ride_id } = useParams();
  const [ride, setRide] = useState(null);
  const [usersJoined, setUsersJoined] = useState([]);
  const [acceptedUsers, setAcceptedUsers] = useState([]);
  const [pendingUsers, setPendingUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const otpRef = useRef(null);
  const [showOtpDialog, setShowOtpDialog] = useState(false); // Add state variable for OTP dialog
  const [selectedUserId, setSelectedUserId] = useState(null);

  useEffect(() => {
    const fetchRideDetails = async () => {
      try {
        const rideRef = doc(db, 'rides', ride_id);
        const rideDoc = await getDoc(rideRef);

        if (rideDoc.exists()) {
          const rideData = rideDoc.data();
          setRide(rideData);

          // Fetch users who joined the ride
          const usersJoinedRef = collection(db, 'rides', ride_id, 'UsersJoined');
          const usersJoinedSnapshot = await getDocs(usersJoinedRef);
          const usersJoinedData = usersJoinedSnapshot.docs.map((doc) => doc.data());
          setUsersJoined(usersJoinedData);

          // Filter and set the accepted users
          const acceptedUsersData = usersJoinedData.filter(
            (user) => user.carpool_status === 'accepted'
          );
          setAcceptedUsers(acceptedUsersData);

          // Filter and set the pending users
          const pendingUsersData = usersJoinedData.filter(
            (user) => user.carpool_status === 'pending'
          );
          setPendingUsers(pendingUsersData);
        } else {
          console.log('Ride not found');
        }
      } catch (error) {
        console.error('Error fetching ride details:', error);
      }
    };

    fetchRideDetails();
  }, [ride_id]);

  const handleAccept = async (userId, seats) => {
    try {
      if (ride.seats === 0) {
        setModalMessage('Vehicle capacity is full');
        setShowModal(true);
        return;
      }

      const remainingSeats = ride.seats - seats;

      if (remainingSeats < 0) {
        setModalMessage('Not enough seats available');
        setShowModal(true);
        return;
      }

      // Update carpool_status to accepted for the selected user
      const userRef = doc(db, 'rides', ride_id, 'UsersJoined', userId);
      await updateDoc(userRef, { carpool_status: 'accepted' });

      // Update seats in the rides collection
      const rideRef = doc(db, 'rides', ride_id);
      await updateDoc(rideRef, { seats: remainingSeats });


          // Create a document in the carpoolsjoined subcollection for the accepted user
    const carpoolsJoinedRef = doc(db, 'users', userId, 'CarpoolsJoined', ride_id);
    await setDoc(carpoolsJoinedRef, {
      ride_id,
      ride_otp: ride.ride_otp,
      drop_otp: ride.drop_otp,
      // driver_info : 'pick up',
    });


      // Navigate to the home page
      window.location.href = `/activerides/${ride.ride_id}`;
    } catch (error) {
      console.error('Error accepting ride:', error);
    }
  };

  const handleReject = async (userId) => {
    try {
      // Update carpool_status to rejected for the selected user
      const userRef = doc(db, 'rides', ride_id, 'UsersJoined', userId);
      await updateDoc(userRef, { carpool_status: 'rejected' });

      // Navigate to the home page
      window.location.href = `/activerides/${ride.ride_id}`;
    } catch (error) {
      console.error('Error rejecting ride:', error);
    }
  };

  const handleCancelRide = async () => {
    try {
      // Update the status of the ride to "cancelled"
      const rideRef = doc(db, 'rides', ride_id);
      await updateDoc(rideRef, { ride_status: 'cancelled' });

      // Navigate to the home page
      window.location.href = '/activerides';
    } catch (error) {
      console.error('Error cancelling ride:', error);
    }
  };


  const handlePickup = (userId) => {
    setSelectedUserId(userId);

    setShowOtpDialog(true); // Show OTP dialog
  };

  const handleVerifyOtp = async () => {
    const otpInput = otpRef.current.value;
  
    try {
      const rideRef = doc(db, 'rides', ride_id);
      const rideDoc = await getDoc(rideRef);
  
      if (rideDoc.exists()) {
        const rideData = rideDoc.data();
        const rideOtp = Number(rideData.ride_otp);
  
        const userRef = doc(db, 'rides', ride_id, 'UsersJoined', selectedUserId);
        const userDoc = await getDoc(userRef);
  
        if (userDoc.exists()) {
          const userData = userDoc.data();
          const driverInfo = userData.driver_info;
  
          if (driverInfo === 'pick up' && rideOtp === Number(otpInput)) {
            // OTP verified successfully for pick up
            await updateDoc(userRef, { driver_info: 'drop off' });
            setShowOtpDialog(false); // Close OTP dialog
            window.location.href = `/activerides/${ride.ride_id}`;

          } else if (driverInfo === 'drop off' && Number(rideData.drop_otp) === Number(otpInput)) {
            // OTP verified successfully for drop off
            await updateDoc(userRef, { driver_info: 'completed' });
  
            // const rideRef = doc(db, 'rides', ride_id);
            // await updateDoc(rideRef, { ride_status: 'completed' });
  
            setShowOtpDialog(false); // Close OTP dialog
            setButtonDisabled(true); // Disable the button
            window.location.href = `/activerides/${ride.ride_id}`;

            // Check if all accepted users have completed their drop off
          const usersJoinedRef = collection(db, 'rides', ride_id, 'UsersJoined');
          const usersJoinedSnapshot = await getDocs(usersJoinedRef);
          const allCompleted = usersJoinedSnapshot.docs.every((userDoc) => {
            const userData = userDoc.data();
            return userData.driver_info === 'completed';
          });

          if (allCompleted) {
            // Update ride_status to completed
            await updateDoc(rideRef, { ride_status: 'completed' });
          }
            } else {
            setModalMessage('Invalid OTP');
            setShowModal(true);

          }
        } else {
          console.log('User not found');
        }
      } else {
        console.log('Ride not found');
      }
    } catch (error) {
      console.error('Error fetching ride details:', error);
    }
  };
  

  if (!ride) {
    return <p>Loading ride details...</p>;
  }

  return (
    <div>
      <div className="ride-results">
        <div className="ride-head">
          <h3 style={{ textAlign: 'center', color: 'white' }}>
            {ride.start_loc} to {ride.end_loc}
          </h3>
          <Button
            style={{ textAlign: 'right', color: 'white', backgroundColor: 'green' }}
            onClick={handleCancelRide}
          >
            Cancel Ride
          </Button>
        </div>
      </div>

      <Tabs defaultActiveKey="accepted"
      id="users-tabs"
      style={{ backgroundColor: '#f5f5f5', padding: '10px' }}
      variant="pills"
      className="custom-tabs">
        <Tab eventKey="accepted" title={<span style={{ fontWeight: 'bold'}}>Accepted Users</span>}>
        <div className="card-results">
          {acceptedUsers.length === 0 ? (
            <p>No users have been accepted for this ride yet.</p>
          ) : (
            <Container className="gridbox">
              <Row className="gridrow">
                {acceptedUsers.map((user) => (
                  <div className="ride-card" key={user.user_id}>
                    <h2 id="loc">start location</h2>
                    <h2 id="type">{user.start_loc}</h2> 
                   
                      <h2 id="loc">end location</h2>
                    <h2 id="type">{user.end_loc}</h2> 

                    <h2 className="type">User name</h2>
                    <h2 id="type">{user.user_name}</h2>
                    <h2 className="type">Seats requested</h2>
                    <h3 id="type">{user.seats}</h3>

                    <input type="button" value="Chat" className="ride-join" />
<br/><br/>
                    <input type="button" disabled={buttonDisabled} value={user.driver_info} className="ride-join"  onClick={() => handlePickup(user.user_id)} />


                    {showOtpDialog && selectedUserId === user.user_id && (
        <Modal show={true} onHide={() => setShowOtpDialog(false)}> {/* Update onHide prop */}
        <Modal.Header closeButton>
            <Modal.Title>Enter OTP</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <input type="text" placeholder="Enter OTP" ref={otpRef} />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleVerifyOtp}>
              Verify OTP {selectedUserId}
            </Button>
          </Modal.Footer>
        </Modal>
                      )}
                  </div>
                ))}
                
              </Row>
            </Container>
          )}
       
       </div> </Tab>
        <Tab eventKey="pending" title={<span style={{ fontWeight: 'bold'}}>Pending Users</span>}>
        <div className="card-results">
          {pendingUsers.length === 0 ? (
            <p>No users have joined this ride yet.</p>
          ) : (
            <Container className="gridbox">
              <Row className="gridrow">
                {pendingUsers.map((user) => (
                  <div className="ride-card" key={user.user_id}>
                    <h2 id="loc">start location</h2>
                    <h2 id="type">{user.start_loc}</h2>
                    <h2 id="loc">end location</h2>
                    <h2 id="type">{user.end_loc}</h2>

                    <h2 className="type">User name</h2>
                    <h2 id="type">{user.user_name}</h2>
                    <h2 className="type">Seats requested</h2>
                    <h3 id="type">{user.seats}</h3>

                    <input
                      type="button"
                      value="Accept"
                      className="ride-join"
                      onClick={() => handleAccept(user.user_id, user.seats)}
                    />
                    <br />
                    <br />
                    <input
                      type="button"
                      value="Reject"
                      className="ride-join"
                      onClick={() => handleReject(user.user_id)}
                    />
                  </div>
                ))}
              </Row>
            </Container>
          )}
       </div> </Tab>
      </Tabs>

      {/* Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Message</Modal.Title>
        </Modal.Header>
        <Modal.Body>{modalMessage}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default RideDetails;













// import React, { useEffect, useState, useRef } from 'react';
// import { useParams } from 'react-router-dom';
// import { db } from '../firebaseConfig';
// import { collection, doc, getDoc, getDocs, setDoc, updateDoc } from 'firebase/firestore';
// import { Container, Row, Modal, Button, Tab, Tabs } from 'react-bootstrap';

// const RideDetails = () => {
//   const { ride_id } = useParams();
//   const [ride, setRide] = useState(null);
//   const [usersJoined, setUsersJoined] = useState([]);
//   const [acceptedUsers, setAcceptedUsers] = useState([]);
//   const [pendingUsers, setPendingUsers] = useState([]);
//   const [showModal, setShowModal] = useState(false);
//   const [modalMessage, setModalMessage] = useState('');
//   const [buttonDisabled, setButtonDisabled] = useState(false);
//   const otpRef = useRef(null);
//   const [showOtpDialog, setShowOtpDialog] = useState(false); // Add state variable for OTP dialog

//   useEffect(() => {
//     const fetchRideDetails = async () => {
//       try {
//         const rideRef = doc(db, 'rides', ride_id);
//         const rideDoc = await getDoc(rideRef);

//         if (rideDoc.exists()) {
//           const rideData = rideDoc.data();
//           setRide(rideData);

//           // Fetch users who joined the ride
//           const usersJoinedRef = collection(db, 'rides', ride_id, 'UsersJoined');
//           const usersJoinedSnapshot = await getDocs(usersJoinedRef);
//           const usersJoinedData = usersJoinedSnapshot.docs.map((doc) => doc.data());
//           setUsersJoined(usersJoinedData);

//           // Filter and set the accepted users
//           const acceptedUsersData = usersJoinedData.filter(
//             (user) => user.carpool_status === 'accepted'
//           );
//           setAcceptedUsers(acceptedUsersData);

//           // Filter and set the pending users
//           const pendingUsersData = usersJoinedData.filter(
//             (user) => user.carpool_status === 'pending'
//           );
//           setPendingUsers(pendingUsersData);
//         } else {
//           console.log('Ride not found');
//         }
//       } catch (error) {
//         console.error('Error fetching ride details:', error);
//       }
//     };

//     fetchRideDetails();
//   }, [ride_id]);

//   const handleAccept = async (userId, seats) => {
//     try {
//       if (ride.seats === 0) {
//         setModalMessage('Vehicle capacity is full');
//         setShowModal(true);
//         return;
//       }

//       const remainingSeats = ride.seats - seats;

//       if (remainingSeats < 0) {
//         setModalMessage('Not enough seats available');
//         setShowModal(true);
//         return;
//       }

//       // Update carpool_status to accepted for the selected user
//       const userRef = doc(db, 'rides', ride_id, 'UsersJoined', userId);
//       await updateDoc(userRef, { carpool_status: 'accepted' });

//       // Update seats in the rides collection
//       const rideRef = doc(db, 'rides', ride_id);
//       await updateDoc(rideRef, { seats: remainingSeats });


//           // Create a document in the carpoolsjoined subcollection for the accepted user
//     const carpoolsJoinedRef = doc(db, 'users', userId, 'CarpoolsJoined', ride_id);
//     await setDoc(carpoolsJoinedRef, {
//       ride_id,
//       ride_otp: ride.ride_otp,
//       drop_otp: ride.drop_otp,
//       // driver_info : 'pick up',
//     });


//       // Navigate to the home page
//       window.location.href = `/activerides/${ride.ride_id}`;
//     } catch (error) {
//       console.error('Error accepting ride:', error);
//     }
//   };

//   const handleReject = async (userId) => {
//     try {
//       // Update carpool_status to rejected for the selected user
//       const userRef = doc(db, 'rides', ride_id, 'UsersJoined', userId);
//       await updateDoc(userRef, { driver_info: 'rejected' });

//       // Navigate to the home page
//       window.location.href = `/activerides/${ride.ride_id}`;
//     } catch (error) {
//       console.error('Error rejecting ride:', error);
//     }
//   };

//   const handleCancelRide = async () => {
//     try {
//       // Update the status of the ride to "cancelled"
//       const rideRef = doc(db, 'rides', ride_id);
//       await updateDoc(rideRef, { ride_status: 'cancelled' });

//       // Navigate to the home page
//       window.location.href = '/activerides';
//     } catch (error) {
//       console.error('Error cancelling ride:', error);
//     }
//   };


//   const handlePickup = (user_id) => {
//     setShowOtpDialog(true); // Show OTP dialog
//   };

//   const handleVerifyOtp = async (user_id) => {
//     const otpInput = otpRef.current.value;
  
//     try {
//       const rideRef = doc(db, 'rides', ride_id);
//       const rideDoc = await getDoc(rideRef);
  
//       if (rideDoc.exists()) {
//         const rideData = rideDoc.data();
//         const rideOtp = Number(rideData.ride_otp);
  
//         const userRef = doc(db, 'rides', ride_id, 'UsersJoined', user_id);
//         const userDoc = await getDoc(userRef);
  
//         if (userDoc.exists()) {
//           const userData = userDoc.data();
//           const driverInfo = userData.driver_info;
  
//           if (driverInfo === 'pick up' && rideOtp === Number(otpInput)) {
//             // OTP verified successfully for pick up
//             await updateDoc(userRef, { driver_info: 'drop off' });
//             setShowOtpDialog(false); // Close OTP dialog
//             window.location.href = `/activerides/${ride.ride_id}`;

//           } else if (driverInfo === 'drop off' && Number(rideData.drop_otp) === Number(otpInput)) {
//             // OTP verified successfully for drop off
//             await updateDoc(userRef, { driver_info: 'completed' });
  
//             // const rideRef = doc(db, 'rides', ride_id);
//             // await updateDoc(rideRef, { ride_status: 'completed' });
  
//             setShowOtpDialog(false); // Close OTP dialog
//             setButtonDisabled(true); // Disable the button
//             window.location.href = `/activerides/${ride.ride_id}`;

//             // Check if all accepted users have completed their drop off
//           const usersJoinedRef = collection(db, 'rides', ride_id, 'UsersJoined');
//           const usersJoinedSnapshot = await getDocs(usersJoinedRef);
//           const allCompleted = usersJoinedSnapshot.docs.every((userDoc) => {
//             const userData = userDoc.data();
//             return userData.carpool_status === 'completed';
//           });

//           if (allCompleted) {
//             // Update ride_status to completed
//             await updateDoc(rideRef, { ride_status: 'completed' });
//           }
//             } else {
//             setModalMessage('Invalid OTP');
//             setShowModal(true);

//           }
//         } else {
//           console.log('User not found');
//         }
//       } else {
//         console.log('Ride not found');
//       }
//     } catch (error) {
//       console.error('Error fetching ride details:', error);
//     }
//   };
  

//   if (!ride) {
//     return <p>Loading ride details...</p>;
//   }

//   return (
//     <div>
//       <div className="ride-results">
//         <div className="ride-head">
//           <h3 style={{ textAlign: 'center', color: 'white' }}>
//             {ride.start_loc} to {ride.end_loc}
//           </h3>
//           <Button
//             style={{ textAlign: 'right', color: 'white', backgroundColor: 'green' }}
//             onClick={handleCancelRide}
//           >
//             Cancel Ride
//           </Button>
//         </div>
//       </div>

//       <Tabs defaultActiveKey="accepted"
//       id="users-tabs"
//       style={{ backgroundColor: '#f5f5f5', padding: '10px' }}
//       variant="pills"
//       className="custom-tabs">
//         <Tab eventKey="accepted" title={<span style={{ fontWeight: 'bold'}}>Accepted Users</span>}>
//         <div className="card-results">
//           {acceptedUsers.length === 0 ? (
//             <p>No users have been accepted for this ride yet.</p>
//           ) : (
//             <Container className="gridbox">
//               <Row className="gridrow">
//                 {acceptedUsers.map((user) => (
//                   <div className="ride-card" key={user.user_id}>
//                     <h2 id="loc">start location</h2>
//                     <h2 id="type">{user.start_loc}</h2> 
                   
//                       <h2 id="loc">end location</h2>
//                     <h2 id="type">{user.end_loc}</h2> 

//                     <h2 className="type">User name</h2>
//                     <h2 id="type">{user.user_name}</h2>
//                     <h2 className="type">Seats requested</h2>
//                     <h3 id="type">{user.seats}</h3>

//                     <input type="button" value="Chat" className="ride-join" />
// <br/><br/>
//                     <input type="button" disabled={buttonDisabled} value={user.driver_info} className="ride-join"  onClick={() => handlePickup(user.user_id)} />


//                     {showOtpDialog && ( // Display OTP dialog if showOtpDialog is true
//         <Modal show={true} onHide={() => setShowOtpDialog(false)}> {/* Update onHide prop */}
//         <Modal.Header closeButton>
//             <Modal.Title>Enter OTP</Modal.Title>
//           </Modal.Header>
//           <Modal.Body>
//             <input type="text" placeholder="Enter OTP" ref={otpRef} />
//           </Modal.Body>
//           <Modal.Footer>
//             <Button variant="secondary" onClick={() => handleVerifyOtp(user.user_id)}>
//               Verify OTP{user.user_id}
//             </Button>
//           </Modal.Footer>
//         </Modal>
//                       )}
//                   </div>
//                 ))}
                
//               </Row>
//             </Container>
//           )}
       
//        </div> </Tab>
//         <Tab eventKey="pending" title={<span style={{ fontWeight: 'bold'}}>Pending Users</span>}>
//         <div className="card-results">
//           {pendingUsers.length === 0 ? (
//             <p>No users have joined this ride yet.</p>
//           ) : (
//             <Container className="gridbox">
//               <Row className="gridrow">
//                 {pendingUsers.map((user) => (
//                   <div className="ride-card" key={user.user_id}>
//                     <h2 id="loc">start location</h2>
//                     <h2 id="type">{user.start_loc}</h2>
//                     <h2 id="loc">end location</h2>
//                     <h2 id="type">{user.end_loc}</h2>

//                     <h2 className="type">User name</h2>
//                     <h2 id="type">{user.user_name}</h2>
//                     <h2 className="type">Seats requested</h2>
//                     <h3 id="type">{user.seats}</h3>

//                     <input
//                       type="button"
//                       value="Accept"
//                       className="ride-join"
//                       onClick={() => handleAccept(user.user_id, user.seats)}
//                     />
//                     <br />
//                     <br />
//                     <input
//                       type="button"
//                       value="Reject"
//                       className="ride-join"
//                       onClick={() => handleReject(user.user_id)}
//                     />
//                   </div>
//                 ))}
//               </Row>
//             </Container>
//           )}
//        </div> </Tab>
//       </Tabs>

//       {/* Modal */}
//       <Modal show={showModal} onHide={() => setShowModal(false)}>
//         <Modal.Header closeButton>
//           <Modal.Title>Message</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>{modalMessage}</Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => setShowModal(false)}>
//             Close
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </div>
//   );
// };

// export default RideDetails;
