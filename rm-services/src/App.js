import React from "react";
import { Routes, Route} from "react-router-dom";
import Home from './Pages/Home'
import Login from './Pages/Login'
import SignUp from "./Pages/SignUp";
import Rides from "./Pages/Rides"
import { AuthContextProvider } from "./context/UserAuthContext";
import ProtectedRoutes from "./components/ProtectedRoutes";


const App = () => {
  return (
    
        <AuthContextProvider>
        <Routes>
            <Route path='/login'  element={<Login/>} />

            <Route path='/signup'  element={<SignUp/>} />

            <Route path='/'  element={<Home/>} />
            
            <Route path='/rides'  element={<ProtectedRoutes> <Rides/> </ProtectedRoutes>} />
            
        </Routes>
        </AuthContextProvider>
          
  );
};

export default App;