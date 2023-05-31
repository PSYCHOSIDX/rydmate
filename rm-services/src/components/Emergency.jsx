import React, {useEffect,useState} from 'react'
import '../components/component-styles/emergency.css'
import EContacts from './AddEmergencyContacts'
import { UserAuth } from '../context/UserAuthContext'
import { db } from '../firebaseConfig';
import { getDocs,collection, deleteDoc, query, where} from 'firebase/firestore'
import {Button} from 'react-bootstrap'




const Emergency = () => {
  const {user} = UserAuth();
  const userId = user.uid
  const [emergencies, setEmergencies] = useState([]);
  const[number, setNumber] = useState();
  const [body, setBody] = useState();
  let emegerncyList = [];
  
// const accountSid = process.env.REACT_APP_ACCOUNT_SID;
// const authToken = process.env.REACT_APP_AUTH_TOKEN;
// const client = require('twilio')(accountSid, authToken);

// const handleClick = async () => {
//   client.messages
//   .create({
//      body: 'This is the ship that made the Kessel Run in fourteen parsecs?',
//      from: '+15017122661',
//      to: '+15558675310'
//    })
//   .then(message => console.log(message.sid));;
  
// }

 
const onSubmit = async (e) => {
  console.log('triggered');
  await e.preventDefault();

  const res = await fetch("../../api/sendMessage", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ emegerncyList , body: 'RydMate Emergency Alert Needs Your Help ' }),
  });

  const data = await res.json();

  if (data.success) {
    await setNumber("");
    await setBody("");
  } else {
    await setNumber("An Error has occurred.");
    await setBody("An Error has occurred.");
  }
};


  useEffect(() => {
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
  },[])
 


  
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

        <Button  id='align' onClick={onSubmit}>
        <b >⚠</b> Raise Emergency
        </Button>
       
    </div>
     
    </>
  )
}

export default Emergency
