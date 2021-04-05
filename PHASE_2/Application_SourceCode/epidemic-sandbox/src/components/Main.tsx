import React from 'react';
import logo from './logo.svg';
import Map from "./Map";
import Navbar from "./Navbar";

function Main() {
  return (
    <div className="Main">
      <body>
        <Navbar/>
        <div id="mapContainer">
            <Map/>
        </div>
      </body>
    </div>
  );
}

export default Main;
