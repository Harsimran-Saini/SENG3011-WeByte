import React from 'react';
import logo from './logo.svg';
import Map from "./Map";
import Navbar, { Routes } from "./Navbar";
import { BrowserRouter as Router } from 'react-router-dom';

function Main() {
  return (
    <div className="Main">
      <body>
        <Router>
          <Routes/>
        </Router>
      </body>
    </div>
  );
}

export default Main;
