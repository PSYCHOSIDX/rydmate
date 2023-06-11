import React, { useState } from 'react';
import { Nav, Navbar, Tab } from 'react-bootstrap';
import ActiveRides from './ActiveRides';
import CancelledRides from './CancelledRides';
import CompletedRides from './CompletedRides';

const RidersNav = () => {
  const [activeTab, setActiveTab] = useState('active');

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div>
      <Navbar bg="light" expand="lg" onSelect={handleTabChange}>
        <Navbar.Brand href="/postride">Post A Ride</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link eventKey="active" onSelect={() => handleTabChange('active')}>
              Active Rides
            </Nav.Link>     
            <Nav.Link eventKey="completed" onSelect={() => handleTabChange('completed')}>
              Completed Rides
            </Nav.Link>
            <Nav.Link eventKey="cancelled" onSelect={() => handleTabChange('cancelled')}>
              Cancelled Rides
            </Nav.Link>
       
          </Nav>
        </Navbar.Collapse>
      </Navbar>

      <Tab.Container activeKey={activeTab}>
        <Tab.Content>
          <Tab.Pane eventKey="active">
            <ActiveRides status="active" />
          </Tab.Pane>
          <Tab.Pane eventKey="completed">
            <CompletedRides status="completed" />
          </Tab.Pane>
          <Tab.Pane eventKey="cancelled">
            <CancelledRides status="cancelled" />
          </Tab.Pane>
          
        </Tab.Content>
      </Tab.Container>
    </div>
  );
};

export default RidersNav;
