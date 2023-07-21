import React, {useEffect,useState} from 'react';
import '../components/component-styles/emergency.css';
import EContacts from './AddEmergencyContacts';
import { UserAuth } from '../context/UserAuthContext';
import { db } from '../firebaseConfig';
import { getDocs,collection, deleteDoc, query, where} from 'firebase/firestore';
import {Button} from 'react-bootstrap';
import { Modal } from 'react-bootstrap';





const Rewards = () => {
  
  const {user} = UserAuth();
  const userId = user.uid;
  const [rewards, setRewards] =useState([]);
  const [credit, setCredit] = useState([]);
  const [amt, setAmt] =useState(0);





    
  useEffect(() => {
    const fetchData = async () => {
      
      const rewardsCollection = collection(db,`users/${userId}/rewards`);
      const rewardsSnapshot = await getDocs(rewardsCollection);
      const rewardsList = rewardsSnapshot.docs.map(doc => doc.data());
      setRewards(rewardsList);
    };
    fetchData();

    
  });

 
  useEffect(() => {
    const fetchData = async () => {
      
      const creditCollection = collection(db,'users/'+userId+'/available_credits/');
      const creditSnapshot = await getDocs(creditCollection);
      const creditList = creditSnapshot.docs.map(doc => doc.data());
      setCredit(creditList);
    };

    fetchData();
  });
  var  price;
credit.map((c)=>{
 price= c.main_credit;
 
})



  const [showx, setShow] = useState(false);
  
  function LaunchWidthdraw() {
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
  
    return (
      <>
         
  
        <Button className='withdraw-btn'  onClick={handleShow}>
          <b > Withdraw Request </b> 
          </Button>
  
        <Modal size="lg" show={showx} onHide={handleClose} animation={false} centered>
          <Modal.Header closeButton>
            <Modal.Title>Confirmation </Modal.Title>
          </Modal.Header>
          <Modal.Body>Are you sure you want to raise a <b>Withdrawal</b> ?</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Cancel
            </Button>
  
            <Button variant="success" >
              Yes
            </Button>
            
          </Modal.Footer>
        </Modal>
      </>
    );
  }

  return (
    <>
    <div className="emergency-component">
    <h1> Rewards</h1>
    <h3> you can withdraw your earned credits through simple request's </h3>
            
    <h2 className='credits'>Total Credits Earned </h2>   

 
 {      

    credit ? <h2 className='amount'>RS.{price}</h2> : <h2 className='amount'>RS.0</h2>
 
}
    

  <LaunchWidthdraw/>

<br />

<h2 className='request-status'> Withdrawals</h2>
 <h5 className='request'>Amount: RS.{500} - status: <b className='status-withdraw'> {'pending'} </b> </h5>

<h2 className='request-status'> Rewards History</h2>  
 {/* {rewards.length === 0 && <h3 className='credits'> Nothing to show yet</h3>} */}

 {

 rewards.map(reward => ( 
    
  <div className='reward-box'>
 
  <h2 className='request'> Ride ID : {reward.ride_id} </h2>  <h5 className='request'> Amount : <b className='status-withdraw'>RS.{reward.amount}</b>  - status: <b className='status-withdraw'> {reward.payment_status} </b> </h5> 
  </div>

  
  ) 
  )
 }
  

<br />
</div>
     
    </>
  )
}

export default Rewards
