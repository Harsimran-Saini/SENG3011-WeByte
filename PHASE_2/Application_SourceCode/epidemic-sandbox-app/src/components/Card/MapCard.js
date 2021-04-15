import React from 'react'
import "./Card.css";
import GoogleMap from 'google-map-react';
import Styles from './MapStyle';

const Card = () => {
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
            
            </GoogleMap>
        </div> 
        </div>

            
    )
}

export default Card
