// import React, { useEffect, useState , useRef} from 'react'
// import search from '../assets/search-new.svg'
// import Dropdown from 'react-bootstrap/Dropdown';
// import DropdownButton from 'react-bootstrap/DropdownButton';
// import Container from 'react-bootstrap/Container';
// import Row from 'react-bootstrap/Row';
// import './component-styles/ridesearch.css';
// import{useJsApiLoader, GoogleMap ,Autocomplete ,DirectionsRenderer ,} from '@react-google-maps/api'
// import {Link} from 'react-router-dom'
// import {db} from '../firebaseConfig';
// import {collection, getDocs} from 'firebase/firestore';  


// const NavigationPage = () => {

  
//     const [rides , setRides]= useState([]);
//     const ridesCollectionRef = collection(db,"rides");
  
  
//     // useEffect(() => {
//     //   const fetchData = async () => {
        
//     //     const ridesSnapshot = await getDocs(ridesCollectionRef);
//     //     const  ridesList= ridesSnapshot.docs.map(doc => doc.data());
//     //     setRides(ridesList);
//     //   };
//     //   fetchData();
//     // });
  
//     // useEffect( ()=>{
//     //     const getRides =  async ()=> {
//     //         const dbdata = await getDocs(ridesCollectionRef);
//     //         setRides(dbdata.docs.map((doc) => ({ ...doc.data(), id:doc.id})));
//     //     }
  
//     //     getRides();
//     // }, [ridesCollectionRef]);
  
  
//     const center = {lat:15.280347,lng:73.980065};
  
  
//     const [map, setMap]= useState(/**@type google.maps.Map */null);
//     const [directionsResponse, setDirectionsResponse]=useState(null);
//     const [distance, setDistance]= useState('')
  
//     /**@type React.MutableRefObject<HTMLInputElement>*/
//     const originRef = useRef()
//     const destinationRef = useRef()
  
    
// //   async function calculateRoute(){
// //     if(originRef.current.value === ' ' || destinationRef.current.value === ' '){
// //       return 
// //     }
    
// //     const directionService = new global.google.maps.DirectionsService();
  
// //     const result = await directionService.route({
// //       origin: originRef.current.value,
// //       destination: destinationRef.current.value,
// //       travelMode: global.google.maps.TravelMode.DRIVING,
// //     }) 
  
// //     setDirectionsResponse(result)
// //     setDistance(result.routes[0].legs[0].distance.text)
  
// //   }
    
  
  
//   const {isLoaded} = useJsApiLoader({
//     libraries:["places"],
//     googleMapsApiKey: process.env.REACT_APP_GMAPS_KEY,
  
//   })
  
  
  
  
  
//   if(!isLoaded){
//     return <p style={{textAlign:'center', color:'white', }}> Loading Maps ...</p>
//   }
    
     
    
  
  




//   return (

//     <>
      
//        <div className="mapbox" style={{ marginTop: '0rem' }}>

//       <GoogleMap  className='gmap' center={center} zoom={15} 
//                 mapContainerStyle={{ width:'90%', height:'25rem',margin:'auto',borderRadius:'.9rem', marginBottom:'1rem'}} 
//                  options={{
//                   streetViewControl: false,
                 
//                   fullscreenControl: false,
         
//                   mapId: "c592e5989eb34504",
//                   keyboardShortcuts:false,
//                   gestureHandling: "greedy",
                  
//                  }}
//                  onLoad={map => setMap(map)}
//                  >

                  
//                   {directionsResponse && 
//                   <DirectionsRenderer directions={directionsResponse}/>}

//         </GoogleMap> 
               
//       </div>

//       {/* <div className="ride-results">
//         <div className="ride-head">
//             <h2>Rides Found</h2>

//         <DropdownButton id="dropdown-basic-button" title="Sort">
//             <Dropdown.Item href="#/action-1"><b>cost : </b>low to high</Dropdown.Item>
//             <Dropdown.Item href="#/action-2"> <b> cost : </b> high to  low</Dropdown.Item>
//             <Dropdown.Item href="#/action-3"> <b> vehicle type</b></Dropdown.Item>
//         </DropdownButton>
         
//         </div>
//       </div> */}



// {/* card holder and data */}

// {/* 

// <div className="card-results">
//         {/* {!ridesJoinedExists ? (
//           <h2>No rides joined yet. <Link to="/rides" className='link'>
//            Join your first carpool
//           </Link></h2>
//         )
            
//          : ( */}
//           {/* <Container className="gridbox">
//             <Row className="gridrow"> */}
//               {/* {rides.map((ride) => (
//                <Link to={`/activerides/${ride.ride_id}`} key={ride.ride_id}> */}
//                {/* <div className="ride-card">
//                   <h2 id="loc">
//                     {'ride.start_loc'} to {'ride.end_loc'}
//                   </h2>
//                   <div className="line"> .</div>

//                   <h2 className="type">Vehicle name</h2>
//                   <h2 id="type">{'ride.vehicle_name'}</h2>
//                   <h2 className="type">Vehicle type</h2>
//                   <h3 id="type">{'ride.vehicle_type'}</h3>
//                   <h2 className="type">Vehicle No</h2>
//                   <h3 id="type">{'ride.vehicle_number'}</h3>
//                    <h2 id="type"> status {'ride.ride_status'}</h2> */}
//                   {/* <h5 id="cost">Cost Per Km</h5> */}
//                  {/* <h2 id="realcost">{ride.cost_per_km}</h2> */}
//                   {/* <input type="button" value= 'Chat' className="ride-join" />
//                   </div> */}
//       {/* </Link>
//               ))} */}
//             {/* </Row>
//           </Container> */}
//         {/* )} */}
//       {/* </div>  */}



//     </>
//   )
// }

// export default NavigationPage

import React, { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router';
import { useJsApiLoader, Autocomplete, DirectionsRenderer, GoogleMap } from '@react-google-maps/api';

const NavigationPage = () => {
  const [map, setMap] = useState(null);
  const [directionsResponse, setDirectionsResponse] = useState(null);

  const location = useLocation();
  console.log(location.state.lat)

  const origin = useRef(null);
  const destination = useRef(null);

  useEffect(() => {
    if (map && origin.current && destination.current) {
      calculateRoute();
    }
  }, [map]);

  async function calculateRoute() {
    // Same as before: Coords for Cuncolim, Goa, India
    const origin = { lat: 15.2560, lng: 73.9559 };
    // Same as before: Coords for Panjim, Goa, India
    const destination = { lat: 15.4989, lng: 73.8278 };
    // Two intermediate points
    const intermediate1 = { lat: 15.2753, lng: 73.9656 };
    const intermediate2 = { lat: 15.3660, lng: 73.9390 };

    const directionsService = new window.google.maps.DirectionsService();

    const result = await directionsService.route({
      origin: new window.google.maps.LatLng(origin.lat, origin.lng),
      destination: new window.google.maps.LatLng(destination.lat, destination.lng),
      waypoints: [
        { location: new window.google.maps.LatLng(intermediate1.lat, intermediate1.lng) },
        { location: new window.google.maps.LatLng(intermediate2.lat, intermediate2.lng) }
      ],
      travelMode: window.google.maps.TravelMode.DRIVING,
    });

    setDirectionsResponse(result);
  }

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GMAPS_KEY,
    libraries: ['places'],
  });

  useEffect(() => {
    if (isLoaded) {
      calculateRoute();
    }
  }, [isLoaded]);

  if (!isLoaded) {
    return <p style={{ textAlign: 'center' }}>Loading Maps...</p>;
  }

  return (
    <div>
      <div style={{ height: '400px', width: '100%' }}>
        <GoogleMap
          center={{ lat: 15.280347, lng: 73.980065 }}
          zoom={15}
          mapContainerStyle={{ height: '100%', width: '100%' }}
          onLoad={setMap}
        >
          {directionsResponse && <DirectionsRenderer directions={directionsResponse} />}
        </GoogleMap>
      </div>
    </div>
  );
};

export default NavigationPage;
