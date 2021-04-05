import React, { useState } from 'react';
import GoogleMap from 'google-map-react';
import Styles from './MapStyle';

const AnyReactComponent: any = ({text}: any) => <div>{text}</div>;

const SimpleMap = (props: any) => {
    const mapOptions = {
      styles: Styles.styles,
      minZoom: 2.5,
    }
    const [center, setCenter] = useState({lat: 0, lng: 0 });
    const [zoom, setZoom] = useState(0);
    return (
        <div style={{ height: '100vh', width: '100%' }}>
        <GoogleMap
          bootstrapURLKeys={{ key: 'AIzaSyCRQt-NkjJ1aa2PqGTu6y7zetkEqtl7s8w' }}
          defaultCenter={center}
          defaultZoom={zoom}
          options={mapOptions}
          
        >
          <AnyReactComponent
            lat={0}
            lng={0}
            text="My Marker"
          />
        </GoogleMap>
      </div>
    );
}

export default SimpleMap;