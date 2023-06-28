import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../firebaseConfig';
import { collection, doc, getDoc, getDocs, updateDoc } from 'firebase/firestore';
import { Container, Row, Modal, Button, Tab, Tabs } from 'react-bootstrap';

const RideDetails = () => {
  const { ride_id } = useParams();
  const [ride, setRide] = useState(null);
  const [usersJoined, setUsersJoined] = useState([]);
  const [acceptedUsers, setAcceptedUsers] = useState([]);
  const [pendingUsers, setPendingUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

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

      // Navigate to the home page
      window.location.href = '/';
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
      window.location.href = '/';
    } catch (error) {
      console.error('Error rejecting ride:', error);
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
                  </div>
                ))}
              </Row>
            </Container>
          )}
       
       </div> </Tab>
        <Tab eventKey="pending" title={<span style={{ fontWeight: 'bold', backgroundColor: 'rgb(49, 208, 150)'}}>Pending Users</span>}>
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
