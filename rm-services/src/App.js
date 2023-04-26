import React from "react";
import { Routes, Route} from "react-router-dom";
// import Home from './Pages/Home'
import Login from './Pages/Login'
import SignUp from "./Pages/SignUp";

import { AuthContextProvider } from "./context/UserAuthContext";


const App = () => {
  return (
    
        <AuthContextProvider>
        <Routes>
            <Route path='/login'  element={<Login/>}/>
            <Route path='/signup'  element={<SignUp/>}/>
        </Routes>
        </AuthContextProvider>
          
     
  );
};

export default App;