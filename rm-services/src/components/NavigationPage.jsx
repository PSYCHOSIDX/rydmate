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

  const loc = useLocation();

  const data = loc.state?.data;
  
 

  const pickup_lat = data ? data.pickup_lat : null;
  const pickup_lng = data ? data.pickup_lng : null;
  const dropoff_lat = data ? data.dropoff_lat : null;
  const dropoff_lng = data ? data.dropoff_lng : null;
  const start_loc = data ? data.start_loc : null;
  const end_loc = data ? data.end_loc : null;
  
console.log(pickup_lng, pickup_lat)
console.log( dropoff_lat,dropoff_lat)
  console.log( dropoff_lng,dropoff_lng)
  console.log(start_loc)
  console.log(end_loc)

  useEffect(() => {
    if (map && origin.current && destination.current) {
      calculateRoute();
    }
  }, [map]);

  async function calculateRoute() {
    // Same as before: Coords for Cuncolim, Goa, India
    // const origin = { lat: 15.2560, lng: 73.9559 };
    // // Same as before: Coords for Panjim, Goa, India
    // const destination = { lat: 15.4989, lng: 73.8278 };
    // Two intermediate points
    const intermediate1 = { lat: pickup_lat, lng: pickup_lng };
    const intermediate2 = { lat: dropoff_lat, lng: dropoff_lng };

    const directionsService = new window.google.maps.DirectionsService();

    const result = await directionsService.route({
      origin: start_loc,
      destination: end_loc,
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
      <div style={{ height: '600px', width: '100%' }}>
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
