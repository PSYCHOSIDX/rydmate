import React, { useEffect, useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";

const Verify = ({uid}) => {


  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [emergencyNumbers, setEmergencyNumbers] = useState("");
  const [age, setAge] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const userRef = doc(db, "users", uid);

      await updateDoc(userRef, {
        emergencyNumbers,
        age,
        contact,
        name
      });

      console.log("User data updated successfully");
    } catch (error) {
      console.error("Error updating user data: ", error);
    }
  }
//   const Verify = () => {
    useEffect(() => {
        console.log(uid);

    }, [uid]);
      
//   };
  return (
    <form onSubmit={handleSubmit}>

        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
      <br />
   
        
        <input
          type="text"
          placeholder="Contact"
          value={contact}
          onChange={(event) => setContact(event.target.value)}
        />
      <br />
    
        <input
          type="text"
          placeholder="Emergency Number"
          value={emergencyNumbers}
          onChange={(event) => setEmergencyNumbers(event.target.value)}
        />
      <br />
      
        <input
          type="number"
          placeholder="Age"
          value={age}
          onChange={(event) => setAge(event.target.value)}
        />
      <br />
      <button type="submit">Submit</button>



      
    </form>
  );
}

export default Verify;