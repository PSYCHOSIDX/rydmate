import React from 'react'
import '../components/component-styles/emergency.css'
import EContacts from './AddEmergencyContacts'
const Emergency = () => {
  return (
    <>
    <div className="emergency-component">
    <h1> Emergency Setup</h1>
    <h3>Please setup your emergency contact on this page and note in case of an emergency these contacts will be prompted for your safety !</h3>
                <div className="contact">
                        <div className="details">
                        <h2>Sameer kamath </h2>
                        <h5>9852457511</h5>

                        </div>
                
                        <div className="button-set">

                        </div>

                </div>

                <div className="contact">
                        <div className="details">
                        <h2>Sameer kamath </h2>
                        <h5>9852457511</h5>

                        </div>
                
                        <div className="button-set">

                        </div>

                </div>
                
                {/* <h6>NO CONTACTS ADDED !</h6> */}

                <EContacts/>
    </div>
     
    </>
  )
}

export default Emergency
