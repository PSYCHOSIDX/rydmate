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
import Nav from "./Pages/Nav";
import Rating from "./components/Rating";

const App = () => {
  return (
    
        <AuthContextProvider>
        <Routes>

            <Route path='/login'  element={<Login/>} />

            <Route path='/signup'  element={<SignUp/>} />

            <Route path='/'  element={<Home/>} />
            
            <Route path='/rides'  element={<ProtectedRoutes> <Rides/> </ProtectedRoutes>} />

            <Route path='/emergency'  element={<ProtectedRoutes> <EmergencyPage/> </ProtectedRoutes>} />

            <Route path='/riderinfo'  element={<ProtectedRoutes> <Rider/> </ProtectedRoutes>} />

            <Route path='/vehicleinfo'  element={<ProtectedRoutes><VehiclePage/></ProtectedRoutes>} />

            <Route path='/postride'  element={<ProtectedRoutes><PostRide/></ProtectedRoutes>} />

            <Route path='/activerides'  element={<ProtectedRoutes><RidesPosted/></ProtectedRoutes>} />

            <Route path="/activerides/:ride_id" element={ <ProtectedRoutes><RidesUsers /></ProtectedRoutes> } />

            <Route path="/viewrides" element={<ProtectedRoutes>< ViewRides/></ProtectedRoutes>  } />

            <Route path="/navigation" element={ <ProtectedRoutes>< Nav/></ProtectedRoutes> } />

            <Route path='/join'  element={<ProtectedRoutes> <JoinPage/> </ProtectedRoutes>} />
            <Route path='/rating'  element={<ProtectedRoutes> <Rating/> </ProtectedRoutes>} />

            <Route path="/404"  element={<ErrorPage/>} />


            
        </Routes>
        </AuthContextProvider>
          
  );
};

export default App;