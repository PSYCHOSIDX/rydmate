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

import ActiveUserRides from './ActiveUserRides';
import CancelledUserRides from './CancelledUserRides';
import CompletedUserRides from './CompletedUserRides';





import React, { useState } from 'react';

import './component-styles/ridesearch.css';

import { UserAuth } from '../context/UserAuthContext';
import { Nav, Navbar, Tab } from 'react-bootstrap';
import 'react-tabs/style/react-tabs.css';

  
const UsersRides = () => {
  const [activeTab, setActiveTab] = useState('active');
  const authContext = UserAuth();
  const currentUserUid = authContext.user && authContext.user.uid;

  const handleTabChange = (tab) => {
    setActiveTab(tab);}




  // useEffect(() => {
  //   const fetchRides = async () => {
  //     try {
  //       const carpoolsJoinedRef = collection(db, 'users', currentUserUid, 'CarpoolsJoined');
  //       const querySnapshot = await getDocs(carpoolsJoinedRef);

  //       const rideIds = querySnapshot.docs.map((doc) => doc.data().ride_id);
  //       const ridesRef = collection(db, 'rides');
  //       const q = query(ridesRef, where('ride_id', 'in', rideIds));
  //       const ridesSnapshot = await getDocs(q);

  //       const ridesData = ridesSnapshot.docs.map((doc) => doc.data());
  //       console.log('Rides data:', ridesData);
  //       const active = ridesData.filter((ride) => ride.ride_status === 'active');
  //       const completed = ridesData.filter((ride) => ride.ride_status === 'completed');
  //       const cancelled = ridesData.filter((ride) => ride.ride_status === 'cancelled');
  //       setActiveRides(active);
  //       setCompletedRides(completed);
  //       setCancelledRides(cancelled);
  //       setIsLoading(false);
  //     } catch (error) {
  //       console.error('Error fetching rides:', error);
  //     }
  //   };

  //   fetchRides();
  // }, []);

  // if (isLoading) {
  //   return <p>Loading rides...</p>;
  // }

  return (
    <>
     <div>
      <Navbar bg="light" expand="lg" onSelect={handleTabChange}>
        <Navbar.Brand href="/rides">Search A Ride</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link eventKey="active" onSelect={() => handleTabChange('active')}>
              Active Carpools
            </Nav.Link>     
            <Nav.Link eventKey="completed" onSelect={() => handleTabChange('completed')}>
              Completed Carpools
            </Nav.Link>
            <Nav.Link eventKey="cancelled" onSelect={() => handleTabChange('cancelled')}>
              Cancelled Carpools
            </Nav.Link>
       
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      <Tab.Container activeKey={activeTab}>
        <Tab.Content>
          <Tab.Pane eventKey="active">
            <ActiveUserRides status="active" />
          </Tab.Pane>
          <Tab.Pane eventKey="completed">
            <CompletedUserRides status="completed" />
          </Tab.Pane>
          <Tab.Pane eventKey="cancelled">
            <CancelledUserRides status="cancelled" />
          </Tab.Pane>
          
        </Tab.Content>
      </Tab.Container>
    {/* </div>
      <div className="ride-results">
        <div className="ride-head">
          {/* <h2>Active Rides</h2> */}
        {/* </div> */}
      {/* </div>

      <div className="card-results">
        <Tabs>
          <TabList>
            <Tab>Active Rides</Tab>
            <Tab>Completed Rides</Tab>
            <Tab>Cancelled Rides</Tab>
          </TabList>

          <TabPanel>
            <Container className="gridbox">
              <Row className="gridrow">
                {activeRides.map((ride) => (
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

                   {/* <div className="line" style={{backgroundColor: 'black' }}> </div>

                   <h2 id="type">pickup otp: {ride.ride_otp}</h2>
                   <h2 id="type">drop otp: {ride.drop_otp}</h2>

                   <input type="button" value="Chat" className="ride-join" />
                </div>                 
                ))}
              </Row>
            </Container>
          </TabPanel>

          <TabPanel>
            <Container className="gridbox">
              <Row className="gridrow">
                {completedRides.map((ride) => (
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
                   <h3 id="type">{ride.departure_time.substring(0,35).replace('T',' ')}</h3> */}
                   {/* <h2 className="type">Ride Status</h2>
                   <h3 id="type">{ride.ride_status}</h3> */}
                   {/* <h5 id="cost">Cost Per Km</h5> */}
                   {/* <h2 id="realcost">{ride.cost_per_km}</h2> */}

                    {/*<div className="line" style={{backgroundColor: 'black' }}> </div>

                   <h2 id="type">pickup otp: {ride.ride_otp}</h2>
                   <h2 id="type">drop otp: {ride.drop_otp}</h2> */}

              {/*     <input type="button" value="Chat" className="ride-join" disabled/>
                </div>                 
                ))}
              </Row>
            </Container>
          </TabPanel>

          <TabPanel>
            <Container className="gridbox">
              <Row className="gridrow">
                {cancelledRides.map((ride) => (
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
                   <h3 id="type">{ride.ride_status}</h3>*/}
                   {/* <h5 id="cost">Cost Per Km</h5> */}
                   {/* <h2 id="realcost">{ride.cost_per_km}</h2> */}

                   {/* <div className="line" style={{backgroundColor: 'black' }}> </div>

                   <h2 id="type">pickup otp: {ride.ride_otp}</h2>
                   <h2 id="type">drop otp: {ride.drop_otp}</h2> */}

                   {/* <input type="button" value="Chat" className="ride-join" disabled/>
                </div>                 
                ))}
              </Row>
            </Container>
          </TabPanel>
        </Tabs>  */}
</div>
    </>
  );
};

export default UsersRides;






// import React, { useEffect, useState } from 'react';
// import Container from 'react-bootstrap/Container';
// import Row from 'react-bootstrap/Row';
// import './component-styles/ridesearch.css';
// import { db } from '../firebaseConfig';
// import { collection, getDocs, query, where } from 'firebase/firestore';
// import { Link } from 'react-router-dom';
// import { UserAuth } from '../context/UserAuthContext';

// const UsersRides = () => {
//   const authContext = UserAuth();
//   const currentUserUid = authContext.user && authContext.user.uid;
  
//   const [rides, setRides] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);

  // useEffect(() => {
  //   const fetchRides = async () => {
  //     try {
  //       const carpoolsJoinedRef = collection(db,'users', currentUserUid, 'CarpoolsJoined');
  //       const querySnapshot = await getDocs(carpoolsJoinedRef);

  //       const rideIds = querySnapshot.docs.map((doc) => doc.data().ride_id);
  //       const ridesRef = collection(db, 'rides');
  //       const q = query(ridesRef, where('ride_id', 'in', rideIds));
  //       const ridesSnapshot = await getDocs(q);

  //       const ridesData = ridesSnapshot.docs.map((doc) => doc.data());
  //       console.log('Rides data:', ridesData);
  //       setRides(ridesData);
  //       setIsLoading(false);
  //     } catch (error) {
  //       console.error('Error fetching rides:', error);
  //     }
  //   };

  //   fetchRides();
  // }, []);

  // if (isLoading) {
  //   return <p>Loading rides...</p>;
  // }

//   return (
//     <>
//       <div className="ride-results">
//         <div className="ride-head">
//           <h2>Active Rides</h2>
//         </div>
//       </div>

//       <div className="card-results">
//         {rides.length === 0 ? (
//           <h2>
//             No rides with usersjoined subcollection found.{' '}
//             <Link to="/rides" className="link">
//               Request a ride
//             </Link>
//           </h2>
//         ) : (
//           <Container className="gridbox">
//             <Row className="gridrow">
//               {rides.map((ride) => (
//                 <div className="ride-card" key={ride.ride_id}>

// <h2 id="loc">
//                     {ride.start_loc} to {ride.end_loc}
//                    </h2>
//                    <div className="line"> </div>

//                    <h2 className="type">Vehicle name</h2>
//                    <h2 id="type">{ride.vehicle_name}</h2>
//                    <h2 className="type">Vehicle type</h2>
//                    <h3 id="type">{ride.vehicle_type}</h3>
//                    <h2 className="type">Vehicle No</h2>
//                    <h3 id="type">{ride.vehicle_number}</h3>
//                    <h2 className="type">Departure Time</h2>
//                    <h3 id="type">{ride.departure_time.substring(0,35).replace('T',' ')}</h3>
//                    <h2 className="type">Ride Status</h2>
//                    <h3 id="type">{ride.ride_status}</h3>
//                    {/* <h5 id="cost">Cost Per Km</h5> */}
//                    {/* <h2 id="realcost">{ride.cost_per_km}</h2> */}

//                    <div className="line" style={{backgroundColor: 'black' }}> </div>

//                    <h2 id="type">pickup otp: {ride.ride_otp}</h2>
//                    <h2 id="type">drop otp: {ride.drop_otp}</h2>

//                    <input type="button" value="Chat" className="ride-join" />
//                 </div>
//               ))}
//             </Row>
//           </Container>
//         )}
//       </div>
//     </>
//   );
// };

// export default UsersRides;
