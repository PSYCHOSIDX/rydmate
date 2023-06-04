import { createContext, useContext, useEffect, useState} from "react";
import { auth, db } from "../firebaseConfig";
import {setDoc, doc, collection, } from "firebase/firestore";

import {createUserWithEmailAndPassword , 
            signInWithEmailAndPassword, 
            signOut,
            onAuthStateChanged, 
            GoogleAuthProvider,
            signInWithPopup,
            
       } from "firebase/auth";

const UserContext = createContext();

export const AuthContextProvider = ({children}) => {
        const [user, setUser] = useState({})
    const userDb = collection(db, "users");


        const createUser = (email, password, displayName, phoneNo) => {
      
           return createUserWithEmailAndPassword(auth, email, password)
            .then(async (result) =>{
                const ref =doc(db, "users", result.user.uid);
                await setDoc(ref, {displayName,phoneNo})
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
    const provider = new GoogleAuthProvider()
    
    signInWithPopup(auth, provider)
    .then(async (result) =>{
        const userRef =result.user.uid;
        await setDoc(doc(userDb, userRef), {
            displayName: result.user.displayName,
            email: result.user.email,
            photoURL: result.user.photoURL,
            phoneNumber: result.user.phoneNumber,
           
        })
        .catch((error)=> {
            console.log(error.message);
        })
    })
    ;;
}

const logout = () => {
    return signOut(auth);
}

        useEffect(() => {
            const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
                setUser(currentUser);
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
