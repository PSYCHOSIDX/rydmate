import React from 'react';
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from './Pages/Home';
import Rides from './Pages/Rides';

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
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
 <RouterProvider router={router} />
);