import React from "react";
import { Routes, Route} from "react-router-dom";
import Home from './Pages/Home'
import Login from './Pages/Login'
import SignUp from "./Pages/SignUp";
import Rides from "./Pages/Rides"
import { AuthContextProvider } from "./context/UserAuthContext";
import ProtectedRoutes from "./components/ProtectedRoutes";
import ErrorPage from "./Pages/ErrorPage";
import EmergencyPage from "./Pages/EmergencyPage";
import JoinPage from "./Pages/JoinPage";
import DriverDetails from "./Pages/DriverDetails";
import PostRide from "./Pages/PostRide";

const App = () => {
  return (
    
        <AuthContextProvider>
        <Routes>
            <Route path='/login'  element={<Login/>} />

            <Route path='/signup'  element={<SignUp/>} />

            <Route path='/'  element={<Home/>} />
            
            <Route path='/rides'  element={<ProtectedRoutes> <Rides/> </ProtectedRoutes>} />

            <Route path='/emergency'  element={<ProtectedRoutes> <EmergencyPage/> </ProtectedRoutes>} />
            <Route path='/driver'  element={<DriverDetails/>} />
            <Route path='/postride'  element={<PostRide/>} />

            <Route path='/join'  element={<ProtectedRoutes> <JoinPage/> </ProtectedRoutes>} />
            
            <Route path='*'  element={<ErrorPage/>} />
        </Routes>
        </AuthContextProvider>
          
  );
};

export default App;