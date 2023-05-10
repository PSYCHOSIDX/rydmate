import ReactDOM from "react-dom/client";

import React from 'react';

import {BrowserRouter as Router } from "react-router-dom"
import App from "./App";
import 'bootstrap/dist/css/bootstrap.min.css';


const root = ReactDOM.createRoot(document.getElementById("root"))
root.render(

  <Router>
    <App />
  </Router>

);