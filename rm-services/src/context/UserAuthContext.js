import { createContext, useContext, useEffect, useState} from "react";
import { auth, db } from "../firebaseConfig";
import {setDoc, doc} from "firebase/firestore";

import {createUserWithEmailAndPassword , 
            signInWithEmailAndPassword, 
            signOut,
            onAuthStateChanged, 
            GoogleAuthProvider,
            signInWithPopup
       } from "firebase/auth"

const UserContext = createContext();

export const AuthContextProvider = ({children}) => {
        const [user, setUser] = useState({})
    


        const createUser = (email, password, displayName, phoneNo) => {
      
           return createUserWithEmailAndPassword(auth, email, password)
            .then(async (result) =>{
                console.log(result.user);
                const ref =doc(db, "users", result.user.uid);
                const docRef = await setDoc(ref, {displayName,phoneNo})
                .then((e) =>{
               
                        alert('Account Created Successfully');
                   
                })
                .catch((error)=> {
                    console.log(error.message);
                })
            })
            ;
        }




const signin = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
}

const googleSignIn = (email, password) =>{
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider);
}

const logout = () => {
    return signOut(auth);
}

        useEffect(() => {
            const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
                console.log(currentUser);
                setUser(currentUser)
            })

            return ()=>{
                unsubscribe();
            }
        },[])

        return (<UserContext.Provider value={{createUser, user, logout, signin, googleSignIn}}>
                    {children}
                </UserContext.Provider>
        )
}


export const UserAuth = () => {
    return useContext(UserContext);
}
