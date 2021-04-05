import React from 'react';
import logo from './logo.svg';
import Map from "./components/Map"
import './App.css';

function App() {
  return (
    <div className="App">
      <body>
        <div id="mapContainer">
          <Map/>
        </div>
        
      </body>
      
    </div>
  );
}

export default App;
