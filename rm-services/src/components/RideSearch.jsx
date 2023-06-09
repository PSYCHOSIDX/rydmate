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


const RideSearch = () => {

  const [rides , setRides]= useState([]);
  const ridesCollectionRef = collection(db,"rides");
  

  useEffect(() => {
    const fetchData = async () => {
      
      const ridesSnapshot = await getDocs(ridesCollectionRef);
      const  ridesList= ridesSnapshot.docs.map(doc => doc.data());
      setRides(ridesList);
    };
    fetchData();
  });

  useEffect( ()=>{
      const getRides =  async ()=> {
          const dbdata = await getDocs(ridesCollectionRef);
          setRides(dbdata.docs.map((doc) => ({ ...doc.data(), id:doc.id})));
      }

      getRides();
  }, [ridesCollectionRef]);


  const center = {lat:15.280347,lng:73.980065};


  const [map, setMap]= useState(/**@type google.maps.Map */null);
  const [directionsResponse, setDirectionsResponse]=useState(null);
  const [distance, setDistance]= useState('')

  /**@type React.MutableRefObject<HTMLInputElement>*/
  const originRef = useRef()
  const destinationRef = useRef()

  
async function calculateRoute(){
  if(originRef.current.value === ' ' || destinationRef.current.value === ' '){
    return 
  }
  
  const directionService = new global.google.maps.DirectionsService();

  const result = await directionService.route({
    origin: originRef.current.value,
    destination: destinationRef.current.value,
    travelMode: global.google.maps.TravelMode.DRIVING,
  }) 

  setDirectionsResponse(result)
  setDistance(result.routes[0].legs[0].distance.text)

}
  


const {isLoaded} = useJsApiLoader({
  libraries:["places"],
  googleMapsApiKey: process.env.REACT_APP_GMAPS_KEY,

})





if(!isLoaded){
  return <p style={{textAlign:'center', color:'white', }}> Loading Maps ...</p>
}
  
   
  





  return (

    <>
      <div className="search-holder">
        <div className="search-top">
                <img src={search} alt="Search Background"  className='search-img'/>
        </div>

        <div className="search-bottom">
            <h1 className='search-text'>Find Your Next Ride Superfast !</h1>

            <div className='form-holder'>
               

                <Autocomplete className='auto' options={{
                  componentRestrictions: {country : "ind"}
                }}
                >
                   <input type="text" placeholder='📍From' className='phold'  ref={originRef}/>
                </Autocomplete>

                <Autocomplete className='auto' options={{
                  componentRestrictions: {country : "ind"}
                }}>
                  <input type="text" placeholder='📍To' className='phold' ref={destinationRef}/>
                </Autocomplete>
                  <div>
                
                  </div>
               
                
                
                <button  onClick={calculateRoute} className='search-btn'>Search</button>
            </div>
        </div>

      </div>


      <div className="mapbox">

      <GoogleMap  className='gmap' center={center} zoom={15} 
                mapContainerStyle={{ width:'90%', height:'25rem',margin:'auto',borderRadius:'.9rem', marginBottom:'1rem'}} 
                 options={{
                  streetViewControl: false,
                 
                  fullscreenControl: true,
         
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

      <div className="ride-results">
        <div className="ride-head">
            <h2>Rides Found</h2>

        <DropdownButton id="dropdown-basic-button" title="Sort">
            <Dropdown.Item href="#/action-1"><b>cost : </b>low to high</Dropdown.Item>
            <Dropdown.Item href="#/action-2"> <b> cost : </b> high to  low</Dropdown.Item>
            <Dropdown.Item href="#/action-3"> <b> vehicle type</b></Dropdown.Item>
        </DropdownButton>
         
        </div>
      </div>



{/* card holder and data */}



      <div className="card-results">

    <Container className='gridbox'>
      <Row text-center className='gridrow'>

        {rides.map((ride) => {

        let cost = 0;    
        if(ride.vehicle_type === 'suv'|| ride.vehicle_type === 'SUV'){
            cost=7;
         
        }else if (ride.vehicle_type === 'bike' || ride.vehicle_type === 'BIKE'){
          cost=3;
          
        }else if (ride.vehicle_type ==='hatchback'|| ride.vehicle_type === 'HATCHBACK'){
          cost=5;
          
        }
   
          return  ( 


// Ride Card        
    <div className="ride-card">
                    
          <h2 id="loc"><b>FROM</b> {ride.start_loc} <br/> <b>TO</b> {ride.end_loc}</h2>
          
            <div className="line"> .</div>

            <h2 id="name">{ride.rider_name}</h2>

            <h2 className='type'>Vehicle type </h2>
            <h3 id='type'>{ride.vehicle_type}</h3>

            <h2 className='type'>Vehicle No </h2>
            <h3 id='type'>{ride.vehicle_number}</h3>
            <h2 className='type'>Vehicle Model </h2>
            <h3 id='type'>{ride.vehicle_name}</h3>

            <h2 id='seat'>Seats Available </h2>
            <h2 id='realcost'> {ride.seats}</h2>

            <h5 id='cost'>Cost Per Km</h5>
            <h2 id='realcost'>{cost}</h2>

            <h5 id='cost'>Departure Time</h5>
            <h2 id='realcost'>{ride.departure_time.substring(0,35).replace('T1',' ')}</h2>

        
            
            <Link to='/join' 
            
            
            state={{data:{
              rider_name: ride.rider_name,
              vtype: ride.vehicle_type,
              vnumber: ride.vehicle_number,
              seats: ride.seats,
              start_loc: ride.start_loc,
              end_loc:ride.end_loc,
              total_distance:ride.total_distance,
              ride_id:ride.ride_id,
              departure_time:ride.departure_time,
              originStart: ride.start_loc,
              vehicle_image: ride.vehicle_image,
              vehicle_name: ride.vehicle_name
            }}}

            className='link'>
            <input type="button" value='Join' className='ride-join'/>
            </Link>
            
    </div>  
          );
              })
              
        } 




      </Row>
    </Container>

 
        </div>



    </>
  )
}

export default RideSearch
