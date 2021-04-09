import "./Main.css";
//import hello from "../../images/logo.svg";
//import Chart from "../charts/Chart";
import React from 'react';
//import {GoogleMapReact, LocationPin} from 'google-maps-react';
import GoogleMap from 'google-map-react';
import Styles from './MapStyle';

// const location = {
//   address: '1600 Amphitheatre Parkway, Mountain View, california.',
//   lat: 37.42216,
//   lng: -122.08427,
// }

const Main = () => {
  const mapOptions = {
    styles: Styles.styles,
    minZoom: 2.5,
  }
  return (
    <div>
    
        
    <main>
      <div className="main__container">
        {/* <!-- MAIN TITLE STARTS HERE --> */}

        <div className="main__title">
          <div className="main__greeting">
            <h1><i className="fa fa-home"></i>  / Dashboard</h1>
          </div>
        </div>

        {/* <!-- MAIN TITLE ENDS HERE --> */}

        {/* <!-- CHARTS STARTS HERE --> */}
        <div className="charts">
          <div className="charts__left">
            <div className="charts__left__title">
              <div>
                <h1><i class="fa fa-map-marker"></i>    Health Map</h1>
                <p>COVID Cases 2020</p>
              </div>
              
            </div>
            <div style={{ height: '50vh', width: '100%' }}>
        <GoogleMap
          bootstrapURLKeys={{ key: 'AIzaSyDEYq35gpEqFPG56D5YlUqBUlGyV8I5MBI' }}
          defaultZoom={0}
          defaultCenter={{ lat: 0, lng: 0 }}
          options={mapOptions}
          
        >
         
        </GoogleMap>
      </div>          
            {/*<Chart />*/}
          </div>

          <div className="charts__right">
            <div className="charts__right__title">
              <div>
                {/* <h1>Stats Reports</h1>
                <p>Cupertino, California, USA</p> */}
              </div>
              <i className="fa fa-usd" aria-hidden="true"></i>
            </div>

            <div className="charts__right__cards">
              <div className="card1">
                {/* <h1>Income</h1>
                <p>$75,300</p> */}
              </div>

              <div className="card2">
                {/* <h1>Sales</h1>
                <p>$124,200</p> */}
              </div>

              <div className="card3">
                {/* <h1>Users</h1>
                <p>3900</p> */}
              </div>

              <div className="card4">
                {/* <h1>Orders</h1>
                <p>1881</p> */}
              </div>
            </div>
          </div>
        </div>
        {/* <!-- CHARTS ENDS HERE --> */}
        {/* <!-- MAIN CARDS STARTS HERE --> */}
        <div className="main__cards">
          <div className="card">
            
            <div className="card_inner">
              <p className="text-primary-p"><b>Global COVID-19 Cases</b></p>
              <span className="font-bold text-title">130,787,851</span>
            </div>
          </div>

          <div className="card">
            <i className="fa fa-calendar fa-2x text-red" aria-hidden="true"></i>
            <div className="card_inner">
              {/* <p className="text-primary-p">Times of Watching</p>
              <span className="font-bold text-title">2467</span> */}
            </div>
          </div>

          <div className="card">
            <i
              className="fa fa-video-camera fa-2x text-yellow"
              aria-hidden="true"
            ></i>
            <div className="card_inner">
              {/* <p className="text-primary-p">Number of Videos</p>
              <span className="font-bold text-title">340</span> */}
            </div>
          </div>

          <div className="card">
            <i
              className="fa fa-thumbs-up fa-2x text-green"
              aria-hidden="true"
            ></i>
            <div className="card_inner">
              {/* <p className="text-primary-p">Number of Likes</p>
              <span className="font-bold text-title">645</span> */}
            </div>
          </div>
        </div>
        {/* <!-- MAIN CARDS ENDS HERE --> */}
      </div>
      
    </main>
    </div>
  );
};

export default Main;