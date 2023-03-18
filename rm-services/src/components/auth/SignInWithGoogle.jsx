import {  GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth, db} from "../../firebaseConfig";
import { doc, setDoc} from "firebase/firestore"

export const SignInWithGoogle = () => {
    const provider = new GoogleAuthProvider()
    signInWithPopup(auth,provider)
    .then(async (result) => {
      console.log(result);
      const user = result.user;
      // save user info to Firestore
      console.log(user);
      console.log(user.displayName);
      //const data = user.email;
   
      const data = { email: user.email};
      await setDoc( doc (db, "users", user.uid),data);
     
    },error =>{
      console.log(error.message)
    })
};

export default SignInWithGoogle;




  

