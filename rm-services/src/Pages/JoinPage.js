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
import{useJsApiLoader, GoogleMap ,Autocomplete ,DirectionsRenderer ,} from '@react-google-maps/api'

const JoinPage = (props) => {
  const loc = useLocation()
  
  const data = loc.state?.data;
  const user =UserAuth();
  const [location, setLocation]=useState('');
  const[costKM, setCostKM] =useState('');
  const [directionsResponse, setDirectionsResponse]=useState(null);

  let [distance, setDistance]= useState('')
    let originRef = data.originStart;

   useEffect(()=>{
    if(data.vtype === 'suv'|| data.vtype === 'SUV'){
      setCostKM(7);
      console.log(costKM)
   }else if (data.vtype === 'bike' || data.vtype === 'BIKE'){
    setCostKM(3);
    console.log(costKM)
   }else if (data.vtype ==='hatchback'|| data.vtype === 'HATCHBACK'){
    setCostKM(5);
    console.log(costKM)
   }


   })


   
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
 const finalCost = parseFloat(distance) * parseInt(costKM);
  return (
    <>
      {user ? <NavbarLogout/> : <NavbarLogin/>}       
              
    <Card  className='car-card' bg='light'>
    <Card.Title className='car-title'> {data.rider_name}</Card.Title>
        <ListGroup.Item> <b style={{marginLeft:10, color:'green'}}> ✅ verified rider</b></ListGroup.Item>
        <br/>
       <Card.Img variant="top" className='car-image' src="https://5.imimg.com/data5/ANDROID/Default/2021/7/QX/SA/QH/99210034/img-20201124-wa0007-jpg-500x500.jpg" />
    
      <Card.Body >
      <Form xs="auto" className="sign-form" onSubmit={''}>
      <ListGroup className="list-group-flush">
     
        <ListGroup.Item> <b>From  : </b> {data.start_loc}   </ListGroup.Item>
        <ListGroup.Item> <b>To : </b>  {data.end_loc}   </ListGroup.Item>
        <ListGroup.Item> <b>Cost Per KM : </b>{costKM}</ListGroup.Item>
        <ListGroup.Item> <b>Vehicle Name : </b> Maruti S7</ListGroup.Item>
        <ListGroup.Item> <b>Vehicle Type : </b>{data.vtype}</ListGroup.Item>
        <ListGroup.Item> <b>Vehicle No : </b>{data.vnumber}</ListGroup.Item>
        <ListGroup.Item> <b>Seats Available : </b> {data.seats}</ListGroup.Item>
        <ListGroup.Item> <b>Departure Time : </b> {data.departure_time}</ListGroup.Item>
        
       
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
    {distance? <Button variant="primary"  className='car-pay'>  Request To Join </Button> : null}
      
      </Form>
      </Card.Body>
    </Card>

    <br/>
      <Footer />
    </>
  )
}

export default JoinPage
