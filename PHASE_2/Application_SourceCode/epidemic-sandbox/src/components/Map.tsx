import React, { useState } from 'react';
import GoogleMapReact from 'google-map-react';

const AnyReactComponent: any = ({text}: any) => <div>{text}</div>;

const SimpleMap = (props: any) => {
    const [center, setCenter] = useState({lat: 0, lng: 0 });
    const [zoom, setZoom] = useState(1);
    return (
        <div style={{ height: '100vh', width: '100%' }}>
        <GoogleMapReact
          bootstrapURLKeys={{ key: 'AIzaSyCRQt-NkjJ1aa2PqGTu6y7zetkEqtl7s8w' }}
          defaultCenter={center}
          defaultZoom={zoom}
        >
          <AnyReactComponent
            lat={0}
            lng={0}
            text="My Marker"
          />
        </GoogleMapReact>
      </div>
    );
}

export default SimpleMap;