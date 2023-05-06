import { createContext, useContext, useEffect, useState} from "react";
import { auth } from "../firebaseConfig";

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
        const createUser = (email, password) => {
            return createUserWithEmailAndPassword(auth, email, password);
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
