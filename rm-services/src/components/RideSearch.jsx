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
import {collection, getDocs, query, orderBy, where} from 'firebase/firestore';  


const RideSearch = () => {
  const [rides , setRides]= useState([0]);
  const ridesCollectionRef = collection(db,"rides");
  const [startSearch, setStartSearch] =useState('');
  const [desSearch, setDesSearch] =useState('');
  const [showRides, setShowRides]= useState(true);

  const [allRides, setAllRides] = useState([0]);
  
const getRideVehicle = async () => {
  const q = query(ridesCollectionRef,orderBy('vehicle_type','desc'));
  // const qmain = query(q,where("seats", ">", "0"));
  const data = await getDocs(q);
  const newData = data.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
  }));
  
 setRides(newData);
};

useEffect( () =>{
const getAllRides = async () => {
  const q = query(ridesCollectionRef,where("ride_status", "==", "active"));
  const qmain = query(q,where("seats", ">", 0));
  const DBdata = await getDocs(q);
  setAllRides(DBdata.docs.map((doc) => ({ ...doc.data(), id:doc.id})));
}
  
  getAllRides();
}, []);



useEffect( ()=>{
  const getRides =  async ()=> {
    // const q = query(ridesCollectionRef,where("ride_status", "==", "active"));
    // const qmain = query(q,where("seats", ">", "0"));
    const q = query(ridesCollectionRef, 
      where("ride_status", "==", "active"),
      where("seats", ">", 0)
    );
      const dbdata = await getDocs(q);
      console.log(dbdata)
      setRides(dbdata.docs.map((doc) => ({ ...doc.data(), id:doc.id})));
  }

  getRides();
}, []);


 

  const center = {lat:15.280347,lng:73.980065};
  const [map, setMap]= useState(/**@type google.maps.Map */null);
  const [directionsResponse, setDirectionsResponse]=useState(null);
  const [distance, setDistance]= useState('')
  const [data, setData] = useState({});
  const [showResults, setShowResults] = useState(false); // New state to track whether to show the cards or not


  /**@type React.MutableRefObject<HTMLInputElement>*/
  const originRef = useRef()
  const destinationRef = useRef()

  
async function calculateRoute(){
  if(originRef.current.value === ' ' || destinationRef.current.value === ' '){
    return 
  }
  
  const directionService = new global.google.maps.DirectionsService();
console.log(originRef.current.value)
  const result = await directionService.route({
    origin: originRef.current.value,
    destination: destinationRef.current.value,
    travelMode: global.google.maps.TravelMode.DRIVING,
  }) 

  // console.log(result)

  setDirectionsResponse(result)
  setDistance(result.routes[0].legs[0].distance.text)

  const { origin, destination } = result.request;

  console.log('Origin:', origin.query); 
  console.log('Destination:', destination.query);

  const apiUrl = 'http://localhost:5000/api/compute'; // Replace with the actual API URL

// Data to be sent in the request body
const requestData = {
  start: origin.query,
  end: destination.query,
};

try {
  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestData),
  });
  const data = await response.json();
  console.log('API response:', data);
// const data = {
//   tOALeWHP72PEXTQaoOZb:{
//       "percentage": '80',
//       "pick_up":{lat:'1.66', lng: '5.66'},
//       "drop_off":{lat:'3.66', lng: '7.66'}
//   },
//   N5WasDQ3c1ZzhhSP1stP:{
//     "percentage": '10',
//     "pick_up":{lat:'90.66', lng: '25.66'},
//     "drop_off":{lat:'75.66', lng: '47.66'}
// },

// }
setData(data);
console.log(data)
  // // Assuming you have received the API response and extracted the ride IDs in apiRideIds array
  const apiRideIds = data.map((entry) => Object.keys(entry)[0]);

// console.log(apiRideIds)
// const apiRideIds = [ "tOALeWHP72PEXTQaoOZb","N5WasDQ3c1ZzhhSP1stP"]; // Replace this with the actual API response

// Filter the rides array to display only the rides with matching IDs
const filteredRides = rides.filter((ride) => apiRideIds.includes(ride.id));
console.log(filteredRides)
setRides(filteredRides);

setShowResults(true);

}catch (error) {
  console.error('Error fetching data:', error);
  // Handle the error gracefully or display an error message to the user
}
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
                   <input type="text" placeholder='📍From' className='phold'  ref={originRef} onChange={(e)=>setStartSearch(e.target.value)}/>
                </Autocomplete>

                <Autocomplete className='auto' options={{
                  componentRestrictions: {country : "ind"}
                }}>
                  <input type="text" placeholder='📍To' className='phold' ref={destinationRef} onChange={(e)=>setDesSearch(e.target.value)}/>
                </Autocomplete>
                  <div>
                
                  </div>

                <button  onClick={()=>{calculateRoute()&& setShowRides(false)}} className='search-btn'>Search</button>
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

      { !distance ? null : <h2 id="distance"> <b>Total Distance :</b>{distance} <br /> <br /><b>Average Total Cost</b>:<br />SUV : {parseInt(distance)*7} <br /> Hatch Back / Sedan : {parseInt(distance)*5} <br /> BIKE / Scooty : {parseInt(distance)*3}</h2> }
               
      </div>



      {
        showRides ?

        
            
        <div className="card-results">
        <Container className="gridbox">
          <Row text-center className="gridrow">
            {allRides.filter((item)=>{
        
        return startSearch.toLocaleLowerCase() === '' && desSearch.toLocaleLowerCase() === '' ? item : item.start_loc.toLocaleLowerCase().includes(startSearch.toLocaleLowerCase()) && item.end_loc.toLocaleLowerCase().includes(desSearch.toLocaleLowerCase())
      }).map((ride)=>(
              <div className="ride-card" key={ride.id}>
                <h2 id="loc">
                  <b>FROM</b> {ride.start_loc} <br /> <b>TO</b> {ride.end_loc}
                </h2>

            <div className="line"> </div>

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
            <h2 id='realcost'>{ride.cost_per_km}</h2>

            <h5 id='cost'>Departure Time</h5>
            
            <h2 id='realcost'>{ride.departure_time ? ride.departure_time.substring(0, 35).replace('T', ' ') : ''}</h2>

        
           
            
            </div>
          ))}
          </Row>
        </Container>
        </div>
        
   : null
}



//tanay


      {showResults && ( // Only display the results section when showResults is true
        <>
          <div className="ride-results">
            <div className="ride-head">
              <h2>Rides Found</h2>

              <DropdownButton id="dropdown-basic-button" title="Sort">
                {/* Dropdown items */}
              </DropdownButton>
            </div>
          </div>

          {!rides.length ? ( // Display "No Rides Found" message if rides array is empty
            <h1 id="distance">No Rides Found</h1>
          ) : (
            <div className="card-results">
        <Container className="gridbox">
          <Row text-center className="gridrow">
            {rides.map((ride) => (
              <div className="ride-card" key={ride.id}>
                <h2 id="loc">
                  <b>FROM</b> {ride.start_loc} <br /> <b>TO</b> {ride.end_loc}
</h2>
{/* <h5 id='type' textAlign= 'right'>Match Accuracy: {data[ride.ride_id]?.percentage || 0}%</h5> */}
<h5 id='type' style={{ textAlign: 'right' }}>
    {/* Use Math.round() to round the percentage to the nearest integer */}
    Match Accuracy: {Math.round((data.find((entry) => entry[ride.ride_id])?.[ride.ride_id]?.percentage || 0))}%
  </h5>
            <div className="line"> </div>

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
            <h2 id='realcost'>{ride.cost_per_km}</h2>

            <h5 id='cost'>Departure Time</h5>
            {/* <h2 id='realcost'>{ride.departure_time.substring(0,35).replace('T',' ')}</h2> */}
            <h2 id='realcost'>{ride.departure_time ? ride.departure_time.substring(0, 35).replace('T', ' ') : ''}</h2>

        
            
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
              riders_user_id:ride.user_id,
              departure_time:ride.departure_time,
              originStart: ride.start_loc,
              vehicle_image: ride.vehicle_image,
              vehicle_name: ride.vehicle_name,
              cost_per_seat:ride.cost_per_km,
              otp:ride.ride_otp,
              dropotp: ride.drop_otp,
              // overlap_percentage: data[ride.ride_id]?.percentage || 0,
              pick_up: data.find((entry) => entry[ride.ride_id])?.[ride.ride_id]?.pick_up || '',
              drop_off: data.find((entry) => entry[ride.ride_id])?.[ride.ride_id]?.drop_off || '',
            }}}

            className='link'>
            <input type="button" value='Join' className='ride-join' style={{width : '265px'}}/>
            </Link>
            
            </div>
            ))}
          </Row>
        </Container>
        </div>
          )}
        </>
      )}
    </>
  );
};

export default RideSearch;