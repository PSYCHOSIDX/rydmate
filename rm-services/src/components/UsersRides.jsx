

import ActiveUserRides from './ActiveUserRides';
import CancelledUserRides from './CancelledUserRides';
import CompletedUserRides from './CompletedUserRides';
import React, { useState } from 'react';
import './component-styles/ridesearch.css';
import { UserAuth } from '../context/UserAuthContext';
import { Nav, Navbar, Tab } from 'react-bootstrap';


  
const UsersRides = () => {
  const [activeTab, setActiveTab] = useState('active');
  const authContext = UserAuth();
  const currentUserUid = authContext.user && authContext.user.uid;

  const handleTabChange = (tab) => {
    setActiveTab(tab);}

  return (
    <>
     <div>
      <Navbar bg="light" expand="lg" onSelect={handleTabChange} >
        <Navbar.Brand href="/rides" className='p-4'> 🔎︎ Search A Ride </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">

            <Nav.Link className="ms-auto" eventKey="active" onSelect={() => handleTabChange('active')}>
              Active Carpools
            </Nav.Link>     

            <Nav.Link className="ms-auto" eventKey="completed" onSelect={() => handleTabChange('completed')}>
              Completed Carpools
            </Nav.Link>

            <Nav.Link className="ms-auto" eventKey="cancelled" onSelect={() => handleTabChange('cancelled')}>
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
   
</div>
    </>
  );
};

export default UsersRides;
