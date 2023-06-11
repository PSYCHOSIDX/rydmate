import React from 'react';

const redirectToGoogleMaps = () => {
  const driverOrigin = "cun goa india";
  const driverDestination = "porvorim goa india";
  const riderOrigin = "verna goa india";
  const riderDestination = "panjim goa india";
  
  const driverOriginEncoded = encodeURIComponent(driverOrigin);
  const driverDestinationEncoded = encodeURIComponent(driverDestination);
  const riderOriginEncoded = encodeURIComponent(riderOrigin);
  const riderDestinationEncoded = encodeURIComponent(riderDestination);
  
  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${driverOriginEncoded}&destination=${driverDestinationEncoded}&waypoints=${riderOriginEncoded}|${riderDestinationEncoded}`;
  
  window.location.href = googleMapsUrl;
};

const RedirectPage = () => {
  return (
    <button onClick={redirectToGoogleMaps}>Get Directions</button>
  );
};

export default RedirectPage;


// import React from 'react';

// const redirectToGoogleMaps = () => {
//   const origin = "pernem goa india";
//   const destination = "panjim goa india";
  
//   const originEncoded = encodeURIComponent(origin);
//   const destinationEncoded = encodeURIComponent(destination);
  
//   const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${originEncoded}&destination=${destinationEncoded}`;
  
//   window.location.href = googleMapsUrl;
// };

// const RedirectPage = () => {
//   return (
//     <button onClick={redirectToGoogleMaps}>Get Directions</button>
//   );
// };

// export default RedirectPage;
