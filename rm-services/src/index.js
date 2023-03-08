import React from 'react';
import ReactDOM from 'react-dom/client';
import './global-styles/global.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from './Pages/Home';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";



const router =createBrowserRouter([
{
  path: "/",
  element: <Home/>
},
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
 <RouterProvider router={router} />
);