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
import PostRide from "./Pages/PostRide";
import RidesPosted from "./Pages/RidesPosted";
import Rider from "./Pages/Rider";
import VehiclePage from "./Pages/VehiclePage";
import RidesUsers from "./Pages/RidesUsers";
import ViewRides from "./Pages/ViewRides";

const App = () => {
  return (
    
        <AuthContextProvider>
        <Routes>

            <Route path='/login'  element={<Login/>} />

            <Route path='/signup'  element={<SignUp/>} />

            <Route path='/'  element={<Home/>} />
            
            <Route path='/rides'  element={<ProtectedRoutes> <Rides/> </ProtectedRoutes>} />

            <Route path='/emergency'  element={<ProtectedRoutes> <EmergencyPage/> </ProtectedRoutes>} />
            <Route path='/riderinfo'  element={<Rider/>} />
            <Route path='/vehicleinfo'  element={<VehiclePage/>} />
            <Route path='/postride'  element={<PostRide/>} />
            <Route path='/activerides'  element={<RidesPosted/>} />
            <Route path="/activerides/:ride_id" element={ <RidesUsers /> } />
            <Route path="/viewrides" element={ < ViewRides/> } />

            <Route path='/join'  element={<ProtectedRoutes> <JoinPage/> </ProtectedRoutes>} />
            
            <Route path="/404"  element={<ErrorPage/>} />


            
        </Routes>
        </AuthContextProvider>
          
  );
};

export default App;