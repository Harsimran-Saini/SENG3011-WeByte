import "./Main.css";
//import hello from "../../images/logo.svg";
//import Chart from "../charts/Chart";
import React from 'react';
//import {GoogleMapReact, LocationPin} from 'google-maps-react';
import GoogleMap from 'google-map-react';
import Styles from './MapStyle';
import { Line } from "react-chartjs-2";

const data = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  datasets: [
    {
      label: "Global Deaths",
      data: [3323, 53233, 85333, 412323, 44123, 65232, 10332, 13023, 29302, 2839283, 28392833, 2839283],
      fill: true,
      backgroundColor: "rgba(75,192,192,0.2)",
      borderColor: "rgba(75,192,192,1)"
    },
    {
      label: "Second dataset",
      data: [33, 25, 35, 51, 54, 76],
      fill: false,
      borderColor: "#742774"
    }
  ]
};

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

        {/* <!-- MAIN CARDS STARTS HERE --> */}
        
        <div className="main__cards">
          <div className="card">
            
            <div className="card_inner">
              <p className="p">Global COVID-19 Cases</p>
              <hr></hr>
              <br></br>
              <span className="font-bold text-title">130,787,851</span>
            </div>
          </div>

          <div className="card">
            <div className="card_inner">
              <p className="text-primary-p">Global COVID-19 Deaths</p>
              <hr></hr>
              <br></br>
              <span className="font-bold text-title">2467</span>
            </div>
          </div>

          <div className="card">
            <div className="card_inner">
              <p className="text-primary-p">Global COVID-19 Vaccinations</p>
              <hr></hr>
              {/* <br></br>
              <span className="font-bold text-title">340</span> */}
              <Line data={data} />
            </div>
          </div>

          
        </div>
        {/* <!-- MAIN CARDS ENDS HERE --> */}
        {/* <!-- CHARTS STARTS HERE --> */}
        <div className="charts">
          <div className="charts__left">
            <div className="charts__left__title">
              <div>
                <h1><i class="fa fa-signal"></i>    Regression Analysis</h1>
                {/* <h1><i class="fa fa-map-marker"></i>    Health Map</h1> */}
              </div>

            </div>
            <hr></hr>
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
                <h1><i class="fa fa-edit"></i>      Google Sheets Template</h1>
              </div>
            </div>
            <hr></hr>
            <iframe title="Google Sheets Template" src="https://docs.google.com/spreadsheets/d/e/2PACX-1vRlw_9hbBksRs9MfxY2J3AMZd4nwhssHxuNBBIyInRj3rRe6YV_GvXohMErj1b2YNo6ZV5a0tr7hXn4/pubhtml?widget=true&amp;headers=false">Template</iframe>

          </div>
        </div>
        {/* <!-- CHARTS ENDS HERE --> */}
        
      </div>
      
    </main>
    </div>
  );
};

export default Main;