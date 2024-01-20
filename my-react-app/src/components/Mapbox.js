import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import './Mapbox.css'

export const Mapbox = () => {

    const mapContainer = useRef(null);
    const map = useRef(null);

    useEffect(() => {
        if (map.current) return;
        mapboxgl.accessToken = 'pk.eyJ1IjoibWF4aW11c2w1OSIsImEiOiJjbHJtandqdXQwd2dvMmpvZnphOHRvMm9jIn0.XMUyvUmW_sGAUEugPnjTxg';
        map.current = new mapboxgl.Map({
            container: mapContainer.current, // container ID
            style: 'mapbox://styles/mapbox/streets-v12', // style URL
            center: [-74.5, 40], // starting position [lng, lat]
            zoom: 9, // starting zoom
        });
    });

    return (
        <div ref={mapContainer} id='map' className='map' style={{width: '100vw', height: '100vh'}}></div>
    )
}