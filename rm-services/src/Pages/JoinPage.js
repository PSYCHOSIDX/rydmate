import React, { useState, useRef, useEffect, } from 'react'
import NavbarLogin from '../components/NavbarLogin';
import NavbarLogout from '../components/NavbarLogout';
import { UserAuth } from '../context/UserAuthContext';
import Footer from '../components/Footer';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import '../components/component-styles/join.css'
import Button from 'react-bootstrap/esm/Button';
import Form from 'react-bootstrap/Form';
import { useLocation } from 'react-router-dom';
import{useJsApiLoader , Autocomplete } from '@react-google-maps/api'



const JoinPage = (props) => {
  const loc = useLocation()
  const user =  UserAuth();
  const data = loc.state?.data;

  const [location, setLocation]=useState('');
  let [distance, setDistance]= useState('')
  let originRef = data.originStart;

   
   
  /**@type React.MutableRefObject<HTMLInputElement>*/
  const destinationRef = useRef()


  const {isLoaded} = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GMAPS_KEY,
    libraries:["places"]
  })
  if(!isLoaded){
    return <p style={{textAlign:'center'}}> Loading maps</p>
  }


 async function calculateRoute(){
  try{
// eslint-disable-next-line no-undef
const directionService = new google.maps.DirectionsService()
const result = await directionService.route({
  origin: originRef ,
  destination: destinationRef.current.value,
  // eslint-disable-next-line no-undef
  travelMode: google.maps.TravelMode.DRIVING
})
setDistance(result.routes[0].legs[0].distance.text)
console.log(distance)
  }
   catch{
    console.log(Error)
   }
 

 }
 const finalCost = parseFloat(distance) * parseInt(data.cost_per_seat);

 const handleSubmit = (e) =>{
  e.preventDefault();
  if( finalCost === ""){
    alert('please enter a valid amount');
  } else {
    var options = {
      key: process.env.REACT_APP_RAYZORPAY_KEY_ID ,
      key_secret: process.env.REACT_APP_RAYZORPAY_KEY_SECRET ,
      amount: finalCost*100 ,
      currency:"INR",
      name:"RydMate",

      handler: function(response){
        alert(response);
      },
      prefill:{
        name: user.displayName,
        email: user.email,
        contact: "7028193277" 
    },
    notes:{
      address: "Razorpay corporate Office",
    },
    theme:{
      color:'#00FFA3'
    }
  };

  var pay = new window.Razorpay(options);
  pay.open();

 } 
}


 return (
    <>
      {user ? <NavbarLogout/> : <NavbarLogin/>}       
              
    <Card  className='car-card' bg='light'>
    <Card.Title className='car-title'> {data.rider_name}</Card.Title>
        <ListGroup.Item> <b style={{marginLeft:10, color:'green'}}> ✅ verified rider</b></ListGroup.Item>
        <br/>
       { !data.vehicle_image ? <h4> Vehicle Image Missing </h4> :<Card.Img variant="top" className='car-image' src={data.vehicle_image} />} 
       
    
      <Card.Body >
      <Form xs="auto" className="sign-form" onSubmit={''}>
      <ListGroup className="list-group-flush">
     
        <ListGroup.Item> <b>From  : </b> {data.start_loc}   </ListGroup.Item>
        <ListGroup.Item> <b>To : </b>  {data.end_loc}   </ListGroup.Item>
        <ListGroup.Item> <b>Cost Per KM : </b>{data.cost_per_seat}</ListGroup.Item>
        <ListGroup.Item> <b>Vehicle Name : </b>{data.vehicle_name}</ListGroup.Item>
        <ListGroup.Item> <b>Vehicle Type : </b>{data.vtype}</ListGroup.Item>
        <ListGroup.Item> <b>Vehicle No : </b>{data.vnumber}</ListGroup.Item>
        <ListGroup.Item> <b>Seats Available : </b> {data.seats}</ListGroup.Item>
        <ListGroup.Item> <b>Departure Time : </b> {data.departure_time.substring(0,25).replace('T1',' ')}</ListGroup.Item>
        
       
        <Form.Group className="mb-3 none" controlId="formBasicPassword">
        <Autocomplete options={{
                  componentRestrictions: {country : "ind"}
                }}>
          <Form.Control style={{fontSize:12, height:44}} onChange={(e) => setLocation(e.target.value)} type="text"  placeholder="Enter Drop location within route" ref={destinationRef}  required />
          </Autocomplete>
          <Button variant="primary" onClick={calculateRoute} className='car-pay'> Get Total Cost </Button>
        </Form.Group>
    
  
        { distance ? <ListGroup.Item> <b style={{fontSize : 22}}> Total Cost : {finalCost.toFixed(2) }</b></ListGroup.Item> : null}
        
      </ListGroup>
    {distance? <Button variant="primary"  className='car-pay'>  Request To Join </Button> && <Button onClick={handleSubmit} variant="success"  className='pay'>  Pay </Button>: null}
      
      </Form>
      </Card.Body>
    </Card>

    <br/>
      <Footer />
    </>
  )
}

export default JoinPage
