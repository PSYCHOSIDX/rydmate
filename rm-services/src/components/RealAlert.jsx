import React, { useState } from 'react';
import Alert from 'react-bootstrap/Alert';


function RealAlert(props) {
  const [show, setShow] = useState(true);

  if (show) {
    return (
      <Alert variant="success" onClose={() => setShow(false)} dismissible>
        <Alert.Heading> {props.message}</Alert.Heading>
      </Alert>
    );
  }
  
}

export default RealAlert;