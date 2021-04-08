import React from 'react';
import logo from './logo.svg';
import Map from "./Map";
import Navigation from "./Navigation";
import { BrowserRouter as Router } from 'react-router-dom';

function Main() {
  return (
    <div className="Main">
      <body>
        <Router>
          <Navigation/>
        </Router>
      </body>
    </div>
  );
}

export default Main;
