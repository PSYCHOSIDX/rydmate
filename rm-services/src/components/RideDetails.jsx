
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
  const [userPhoneNumbers, setUserPhoneNumbers] = useState({});

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

          // Fetch phone numbers of the accepted users
          const acceptedUserIds = acceptedUsersData.map((user) => user.user_id);
          const phoneNumbers = {};

          for (const userId of acceptedUserIds) {
            const userRef = doc(db, 'users', userId);
            // console.log(userRef)
            const userDoc = await getDoc(userRef);
            // console.log(userDoc)

            if (userDoc.exists()) {
              const userData = userDoc.data();
              // console.log(userData)
              phoneNumbers[userId] = userData.phoneNumber;
            }
          }

          setUserPhoneNumbers(phoneNumbers);
          // console.log(phoneNumbers)

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

// Disable the cancel button if the remaining time is less than 2 hours
const disableCancelButton = () => {
  if (!ride || !ride.departure_time) {
    return false;
  }

  const currentTime = new Date();
  const departureTime = new Date(ride.departure_time);
  const timeDifference = departureTime.getTime() - currentTime.getTime();
  const hoursDifference = Math.floor(timeDifference / (1000 * 60 * 60));

  return hoursDifference < 2;
};

  const handlePickup = (userId) => {
    setSelectedUserId(userId);
    const user = acceptedUsers.find((user) => user.user_id === userId);
    if (user && user.driver_info !== 'completed') {
    setShowOtpDialog(true); // Show OTP dialog
    }
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
  console.log(driverInfo)
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
            setButtonDisabled(true); // Disable the button

            setShowOtpDialog(false); // Close OTP dialog

            // Check if all accepted users have completed their drop off
            const usersJoinedRef = collection(db, 'rides', ride_id, 'UsersJoined');
            const usersJoinedSnapshot = await getDocs(usersJoinedRef);
            const allCompleted = usersJoinedSnapshot.docs
              .filter((userDoc) => userDoc.data().carpool_status === 'accepted')
              .every((userDoc) => userDoc.data().driver_info === 'completed');
            
            console.log(allCompleted)

          if (allCompleted) {
            // Update ride_status to completed
            await updateDoc(rideRef, { ride_status: 'completed' });
            window.location.href = `/activerides`;

          }            
          
          window.location.href = `/activerides/${ride.ride_id}`;

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
  
  const handlePhoneCall = (contact) => {
    window.location.href = `tel:${contact}`;
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
          {/* <Button
            style={{ textAlign: 'right', color: 'white', backgroundColor: 'green' }}
            // onClick={handleCancelRide}
          >
            Start Ride
          </Button> */}
          <Button
            style={{ textAlign: 'right', color: 'white', backgroundColor: 'green' }}
            disabled={disableCancelButton()}

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

                    <input
                        type="button"
                        value={userPhoneNumbers[user.user_id] || 'No contact'}
                        className="ride-join"
                        onClick={() => handlePhoneCall(userPhoneNumbers[user.user_id])}
                      /><br/><br/>
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
              Verify OTP 
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









