import "./Main.css";
//import hello from "../../images/logo.svg";
//import Chart from "../charts/Chart";
import React from 'react';
//import {GoogleMapReact, LocationPin} from 'google-maps-react';
import GoogleMap from 'google-map-react';
import Styles from './MapStyle';
import CasesCard from '../Card/Cases_Card'
import DeathsCard from '../Card/Deaths_Card'
import VaccinesCard from '../Card/Vaccines_Card'


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

        <div className="dashboard_title">
          <div className="dashboard">
            <h1><i className="fa fa-home"></i>  / Dashboard</h1>
          </div>
        </div>

        {/* <!-- MAIN TITLE ENDS HERE --> */}

        {/* <!-- MAIN CARDS STARTS HERE --> */}
        
        <div className="top_cards">
          <CasesCard/>
          <DeathsCard/>
          <VaccinesCard/>
        </div>
        {/* <!-- MAIN CARDS ENDS HERE --> */}
        {/* <!-- CHARTS STARTS HERE --> */}
        <div className="first_row">
          <div className="first_row_left">
            <div className="first_row_left_title">
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

          <div className="first_row_right">
            <div className="first_row_right_title">
              <div>
                <h1><i class="fa fa-edit"></i>      Google Sheets Template</h1>
              </div>
            </div>
            <hr></hr>
            <iframe title="Google Sheets Template" src="https://docs.google.com/spreadsheets/d/e/2PACX-1vRlw_9hbBksRs9MfxY2J3AMZd4nwhssHxuNBBIyInRj3rRe6YV_GvXohMErj1b2YNo6ZV5a0tr7hXn4/pubhtml?widget=true&amp;headers=false">Template</iframe>

          </div>
        </div>
        {/* <!-- CHARTS ENDS HERE --> */}
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