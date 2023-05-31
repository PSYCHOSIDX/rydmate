import React, {useEffect,useState} from 'react';
import '../components/component-styles/emergency.css';
import EContacts from './AddEmergencyContacts';
import { UserAuth } from '../context/UserAuthContext';
import { db } from '../firebaseConfig';
import { getDocs,collection, deleteDoc, query, where} from 'firebase/firestore';
import {Button} from 'react-bootstrap';
import {render} from 'react-dom';
import { Modal } from 'react-bootstrap';





const Emergency = () => {
  const {user} = UserAuth();
  const userId = user.uid
  const [emergencies, setEmergencies] = useState([]);
  const[number, setNumber] = useState();
  const [body, setBody] = useState();
  let emegerncyList = [];

  const [lat, setLat] = useState('');
  const [long, setLong] = useState('');

  async function getCurrentLiveLocation() {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          position => {
            const { latitude, longitude } = position.coords;
            resolve({ latitude, longitude });
            setLat(latitude);
            setLong(longitude);
          },
          error => {
            reject(error);
          }
        );
      } else {
        reject(new Error("Geolocation is not supported by this browser."));
      }
    });
  }

const onSubmit = async (e) => {
  console.log('triggered');
  await e.preventDefault();

  const res = await fetch("../../api/sendMessage", {
    
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ to: emegerncyList , body: ' RydMate Emergency Alert \n'+ user.displayName +' with email id '+user.email+'\nNeeds Your Help , please inform your nearest police station\nUsers Last Live Co-ordinates are : \n Latitude : '+lat+'\n Longitude : ' +long }),
   
  }
   );

  const data = await res.json();
 

  if (data.success) {
    await setNumber("");
    await setBody("");
  } else {
    await setNumber("An Error has occurred.");
    await setBody("An Error has occurred.");
  }

  console.log(emegerncyList)
};


  useEffect(() => {
    getCurrentLiveLocation();
    const fetchData = async () => {
      const emergencyCollection = collection(db, `users/${userId}/emergency`);
      const emergencySnapshot = await getDocs(emergencyCollection);
      const emergencyList = emergencySnapshot.docs.map(doc => doc.data());
      setEmergencies(emergencyList);
    };
    fetchData();
  });



  async function deleteEmergency(emergencyName)
  {
    const emergenciesRef = collection(db, `users/${userId}/emergency`);
    const q = query(emergenciesRef, where('emergencyName', '==', emergencyName));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      deleteDoc(doc.ref);
    });

    alert('Emergency Contact Removed');
  }

  useEffect(()=>{
    emergencies.map(emergency=>(
      emegerncyList.push('+91'+emergency.emergencyPhoneNo))
      
      )
  },[emergencies,emegerncyList]);

  const [showx, setShow] = useState(false);
  
function LaunchEmergency() {

  

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
       

      <Button  id='align' onClick={handleShow}>
        <b > ⚠ </b> Raise Emergency
        </Button>

      <Modal size="lg" show={showx} onHide={handleClose} animation={false}>
        <Modal.Header closeButton>
          <Modal.Title>Emergency Confirmation </Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to raise an <b>Emergency Alert</b> ?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="danger" onClick={ onSubmit & handleClose }>
            Raise Emergency
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

 


  
  return (
    <>
    <div className="emergency-component">
    <h1> Emergency Setup</h1>
    <h3>Please setup your emergency contact on this page and note in case of an emergency these contacts will be prompted for your safety !</h3>
                
   { emergencies === ''  &&
      <h6> NO CONTACTS ADDED ! <br/> <br /> </h6>
   
  }
  
    {
    emergencies.map(emergency => (
       
      
        <div className="contact">
            <div className="details">
            <h2>{emergency.emergencyName}</h2>
            <h5>{emergency.emergencyPhoneNo}</h5>
            
            </div>

           <div className="button-set">
            
              <Button  id='del-button' onClick={()=> deleteEmergency(emergency.emergencyName)}>
                Delete
              </Button>
        
            </div>

        </div>

       

      ))  
      
      }
       
        <EContacts/>

        
       <LaunchEmergency/>
    </div>
     
    </>
  )
}

export default Emergency
