import React, { useState } from 'react'
import NavbarLogin from '../components/NavbarLogin';
import NavbarLogout from '../components/NavbarLogout';
import { UserAuth } from '../context/UserAuthContext';
import Footer from '../components/Footer';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import '../components/component-styles/join.css'
import Button from 'react-bootstrap/esm/Button';
import Form from 'react-bootstrap/Form';


const JoinPage = () => {
    const user =UserAuth();
    const [location , setLocation] =useState('');
  return (
    <>
      {user ? <NavbarLogout/> : <NavbarLogin/>}

   
     

    <Card  className='car-card' bg='light'>
    <Card.Title className='car-title'> Ganesh Hams</Card.Title>
        <ListGroup.Item> <b style={{marginLeft:10, color:'green'}}> ✅ verified rider</b></ListGroup.Item>
        <br/>
       <Card.Img variant="top" className='car-image' src="https://5.imimg.com/data5/ANDROID/Default/2021/7/QX/SA/QH/99210034/img-20201124-wa0007-jpg-500x500.jpg" />
    
      <Card.Body >
      <Form xs="auto" className="sign-form" onSubmit={''}>
      <ListGroup className="list-group-flush">
     
        <ListGroup.Item> <b>From  :</b> margao ktc bustand   </ListGroup.Item>
        <ListGroup.Item> <b>To :</b> panjim ktc bustand   </ListGroup.Item>
        <ListGroup.Item> <b>Cost Per KM :</b> 3</ListGroup.Item>
        <ListGroup.Item> <b>Vehicle Name :</b> Maruti S7</ListGroup.Item>
        <ListGroup.Item> <b>Seats Available :</b> 3</ListGroup.Item>
        <ListGroup.Item> <b>Distance :</b> 5</ListGroup.Item>

        <ListGroup.Item> <b>Departure Time :</b> 3:00</ListGroup.Item>
        
       
        <Form.Group className="mb-3 none" controlId="formBasicPassword">
          <Form.Control onChange={(e) => setLocation(e.target.value)} type="text"  placeholder="Enter Drop location within route" required />
        </Form.Group>
    
  
        <ListGroup.Item> <b style={{fontSize : 22}}> Total Cost : 15</b></ListGroup.Item>
        
      </ListGroup>
    
      <Button variant="primary" type='submit' className='car-pay'>  Request To Join</Button>
      </Form>
      </Card.Body>
    </Card>

    <br/>
      <Footer />
    </>
  )
}

export default JoinPage;
