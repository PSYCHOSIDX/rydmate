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

  useEffect(()=>{
      const getRides =  async ()=> {
          const dbdata = await getDocs(ridesCollectionRef);
          setRides(dbdata.docs.map((doc) => ({ ...doc.data()})));
      }

      getRides();
  }, [ridesCollectionRef]);
   
  const center = {lat:15.280347,lng:73.980065};

  const {isLoaded} = useJsApiLoader({
    googleMapsApiKey: 'AIzaSyD6JvemEJL-6CVcynPrTEEuOUG7fesOvGY',
    libraries:['places']
  })

  const [map, setMap]= useState(/**@type google.maps.Map */null);
  const [directionsResponse, setDirectionsResponse]=useState(null);
  const [distance, setDistance]= useState('')

  /**@type React.MutableRefObject<HTMLInputElement>*/
  const originRef = useRef()
  const destinationRef = useRef()



  if(!isLoaded){
    return <p style={{textAlign:'center'}}> Loading maps</p>
  }




async function calculateRoute(){
  if(originRef.current.value === '' || destinationRef.current.value === ''){
    return 
  }
  // eslint-disable-next-line no-undef
  const directionService = new google.maps.DirectionsService()
  const result = await directionService.route({
    origin: originRef.current.value,
    destination: destinationRef.current.value,
    // eslint-disable-next-line no-undef
    travelMode: google.maps.TravelMode.DRIVING
  }) 

  setDirectionsResponse(result)
  setDistance(result.routes[4].legs[0].distance.text)

}


function clearRoute(){
  setDirectionsResponse(null)
  setDistance('')
  originRef.current.value = ''
  destinationRef.current.value =''
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
               

                <Autocomplete className='auto'>
                   <input type="text" placeholder='📍From' className='phold'  ref={originRef}/>
                </Autocomplete>

                <Autocomplete className='auto'>
                  <input type="text" placeholder='📍To' className='phold' ref={destinationRef}/>
                </Autocomplete>
                  <div className="hide">
                  <p> Distance  {distance}</p> <h3 onClick={clearRoute}> <b> Cancel </b></h3>
                <br/>
                <Link to=' ' onClick={calculateRoute} className='search-ride-btn'> Search </Link>
                <h2 onClick={ () => map.panTo(center)}> recenter</h2>
                  </div>
               
                
                
                <button  onClick={calculateRoute} className='search-btn'>Search</button>
            </div>
        </div>

      </div>


      <div className="mapbox">

      <GoogleMap  className='gmap' center={center} zoom={15} 
                mapContainerStyle={{ width:'90%', height:'25rem',margin:'auto',borderRadius:'.5rem', marginBottom:'1rem'}} 
                 options={{
                  streetViewControl: false,
                  mapTypeControl: false,
                  fullscreenControl: false,
                  zoomControl:false

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

        <DropdownButton id="dropdown-basic-button" title="Sort By:Default">
            <Dropdown.Item href="#/action-1">Cost : low to high</Dropdown.Item>
            <Dropdown.Item href="#/action-2">cost : high to  low</Dropdown.Item>
            <Dropdown.Item href="#/action-3">vehicle type</Dropdown.Item>
        </DropdownButton>
         
        </div>
      </div>



{/* card holder and data */}



      <div className="card-results">

    <Container className='gridbox'>
      <Row text-center className='gridrow'>

        {rides.map((rides) => {
          
          return  ( 
          
    <div className="ride-card">
                    
    <h2 id="loc">{rides.start_loc} to {rides.end_loc}</h2>
      <h5 id="dis">Distance {rides.distance} km</h5>
      <div className="line"> .</div>

      <h2 id="name">{rides.rider_name}</h2>
      <h2 className='type'>Vehicle type </h2>
      <h3 id='type'>{rides.vtype}</h3>

      <h2 id='seat'>Seats Available {rides.seats}</h2>

      <h5 id='cost'>Cost Per Km</h5>
      <h2 id='realcost'>{rides.cost_per_seat}</h2>

      <input type="button" value='Join' className='ride-join'/>
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
