import React from 'react'
import "./Card.css";
//import { Map, GoogleApiWrapper, InfoWindow, Marker } from 'google-maps-react';
import GoogleMap from 'google-map-react';
import Styles from './MapStyle';
import CountriesJson from "./latlng.json";
import casesJson from "./cases.json";
import MapPin from "./MapPin"
//import { ListItemSecondaryAction } from '@material-ui/core';
import NewsJson from "./news.json"
function casesMatch(country) {
    return casesJson["Countries"].filter(
        function(data){ return data.Country === country }
    );
}


const Card = () => {
    const locations = [];
    const reportData = NewsJson;
    for (var i in CountriesJson) {
        var country = CountriesJson[i]["name"];
        var lat = CountriesJson[i]["latlng"][0];
        var lon = CountriesJson[i]["latlng"][1];
        var jsonCases = casesMatch(country);
        var cases = 0;
        var newsReports=0;
        if (jsonCases[0] !== undefined) {
            cases = jsonCases[0]["TotalConfirmed"];
        }

        if(reportData !== undefined){
            if (reportData.hasOwnProperty(country.toUpperCase())) {
                newsReports = reportData[country.toUpperCase()];

            }
        }
        var jsonInfo = {country: country, lat: lat, lon: lon, cases: cases, reports: newsReports};
        locations.push(jsonInfo);
    }

    const mapOptions = {
        styles: Styles.styles,
        minZoom: 2.5,
      }
    
    return (
        <div className="map_front" >
            <p><i class="fa fa-map"></i>Health Map</p>
            <hr/>
            <div style={{ height: '50vh', width: '100%' }}>
            <GoogleMap
            bootstrapURLKeys={{ key: 'AIzaSyDEYq35gpEqFPG56D5YlUqBUlGyV8I5MBI' }}
            defaultZoom={0}
            defaultCenter={{ lat: 0, lng: 0 }}
            options={mapOptions}   
            > 
            {
                locations.map(item => {
                return (
                <MapPin lat={item.lat} lng={item.lon} name={item.country} cases={item.cases} reports={item.reports}/>
                )
                
            })
            }
            {/* <Marker onClick={{}} name={'Bob'} position={{lat: 0, lng: -20}}/> */}
            
            </GoogleMap>
        </div> 
        </div>

            
    )
}

export default Card
