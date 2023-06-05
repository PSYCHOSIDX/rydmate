import React, { useEffect, useState , useRef} from 'react'
import search from '../assets/search-new.svg'
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import './component-styles/ridesearch.css';
import{useJsApiLoader, GoogleMap ,Autocomplete ,DirectionsRenderer ,} from '@react-google-maps/api'
import {Link} from 'react-router-dom'
import {db} from '../firebaseConfig';
import {collection, getDocs} from 'firebase/firestore';  


const NavigationPage = () => {

  
    const [rides , setRides]= useState([]);
    const ridesCollectionRef = collection(db,"rides");
  
  
    // useEffect(() => {
    //   const fetchData = async () => {
        
    //     const ridesSnapshot = await getDocs(ridesCollectionRef);
    //     const  ridesList= ridesSnapshot.docs.map(doc => doc.data());
    //     setRides(ridesList);
    //   };
    //   fetchData();
    // });
  
    // useEffect( ()=>{
    //     const getRides =  async ()=> {
    //         const dbdata = await getDocs(ridesCollectionRef);
    //         setRides(dbdata.docs.map((doc) => ({ ...doc.data(), id:doc.id})));
    //     }
  
    //     getRides();
    // }, [ridesCollectionRef]);
  
  
    const center = {lat:15.280347,lng:73.980065};
  
  
    const [map, setMap]= useState(/**@type google.maps.Map */null);
    const [directionsResponse, setDirectionsResponse]=useState(null);
    const [distance, setDistance]= useState('')
  
    /**@type React.MutableRefObject<HTMLInputElement>*/
    const originRef = useRef()
    const destinationRef = useRef()
  
    
//   async function calculateRoute(){
//     if(originRef.current.value === ' ' || destinationRef.current.value === ' '){
//       return 
//     }
    
//     const directionService = new global.google.maps.DirectionsService();
  
//     const result = await directionService.route({
//       origin: originRef.current.value,
//       destination: destinationRef.current.value,
//       travelMode: global.google.maps.TravelMode.DRIVING,
//     }) 
  
//     setDirectionsResponse(result)
//     setDistance(result.routes[0].legs[0].distance.text)
  
//   }
    
  
  
  const {isLoaded} = useJsApiLoader({
    libraries:["places"],
    googleMapsApiKey: process.env.REACT_APP_GMAPS_KEY,
  
  })
  
  
  
  
  
  if(!isLoaded){
    return <p style={{textAlign:'center', color:'white', }}> Loading Maps ...</p>
  }
    
     
    
  
  




  return (

    <>
      


      <div className="mapbox" style={{ marginTop: '0rem' }}>

      <GoogleMap  className='gmap' center={center} zoom={15} 
                mapContainerStyle={{ width:'90%', height:'25rem',margin:'auto',borderRadius:'.9rem', marginBottom:'1rem'}} 
                 options={{
                  streetViewControl: false,
                 
                  fullscreenControl: false,
         
                  mapId: "c592e5989eb34504",
                  keyboardShortcuts:false,
                  gestureHandling: "greedy",
                  
                 }}
                 onLoad={map => setMap(map)}
                 >

                  
                  {directionsResponse && 
                  <DirectionsRenderer directions={directionsResponse}/>}

        </GoogleMap>
               
      </div>

      {/* <div className="ride-results">
        <div className="ride-head">
            <h2>Rides Found</h2>

        <DropdownButton id="dropdown-basic-button" title="Sort">
            <Dropdown.Item href="#/action-1"><b>cost : </b>low to high</Dropdown.Item>
            <Dropdown.Item href="#/action-2"> <b> cost : </b> high to  low</Dropdown.Item>
            <Dropdown.Item href="#/action-3"> <b> vehicle type</b></Dropdown.Item>
        </DropdownButton>
         
        </div>
      </div> */}



{/* card holder and data */}



<div className="card-results">
        {/* {!ridesJoinedExists ? (
          <h2>No rides joined yet. <Link to="/rides" className='link'>
           Join your first carpool
          </Link></h2>
        )
            
         : ( */}
          <Container className="gridbox">
            <Row className="gridrow">
              {/* {rides.map((ride) => (
               <Link to={`/activerides/${ride.ride_id}`} key={ride.ride_id}> */}
               <div className="ride-card">
                  <h2 id="loc">
                    {'ride.start_loc'} to {'ride.end_loc'}
                  </h2>
                  <div className="line"> .</div>

                  <h2 className="type">Vehicle name</h2>
                  <h2 id="type">{'ride.vehicle_name'}</h2>
                  <h2 className="type">Vehicle type</h2>
                  <h3 id="type">{'ride.vehicle_type'}</h3>
                  <h2 className="type">Vehicle No</h2>
                  <h3 id="type">{'ride.vehicle_number'}</h3>
                   <h2 id="type"> status {'ride.ride_status'}</h2>
                  {/* <h5 id="cost">Cost Per Km</h5> */}
                 {/* <h2 id="realcost">{ride.cost_per_km}</h2> */}
                  <input type="button" value= 'Chat' className="ride-join" />
                  </div>
      {/* </Link>
              ))} */}
            </Row>
          </Container>
        {/* )} */}
      </div>



    </>
  )
}

export default NavigationPage
