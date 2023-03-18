import React from 'react';
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from './Pages/Home';
import Rides from './Pages/Rides';
import  Login from './Pages/Login';
import  SignUp from './components/auth/SignUp.jsx';
import Verification from './Pages/Verification';

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";



const router =createBrowserRouter([
{
  path: "/",
  element: <Home/>
},
{
  path: "/rides",
  element: <Rides/>
},
{
  path: "/login",
  element: <Login/>
},

{
  path: "/signup",
  element: <SignUp/>
},
{
  path: "/verify",
  element: <Verification/>
},
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
 <RouterProvider router={router} />
);