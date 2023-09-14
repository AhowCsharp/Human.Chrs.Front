// App.js

import React, { useState,useRef,useEffect} from 'react';
import { GoogleMap, LoadScript ,Marker } from '@react-google-maps/api';
import { useLocation,useNavigate } from 'react-router-dom';

const mapStyles = {
  height: "150px",
  width: "90%",
};



function Map() {

    const [center, setCenter] = useState({lat: 41.3851, lng: 2.1734 });

        // 取得用戶當前位置
        useEffect(() => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition((position) => {
            setCenter({
                lat: position.coords.latitude,
                lng: position.coords.longitude
            });
            });
        }
        }, []);
    return (
        <LoadScript
      googleMapsApiKey="AIzaSyBoZxhV8zRE9wMRfJ6jG1ac0xO0_91cviA" // 請替換為你自己的 API key
    >
      <GoogleMap
        mapContainerStyle={mapStyles}
        zoom={15}
        center={center}
      >
        {/* 添加標記 */}
        <Marker position={center} />
      </GoogleMap>
    </LoadScript>
    );
}

export default Map;
