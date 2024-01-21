import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { MappedIn } from './MappedIn';
import './Mapbox.css'

export const Mapbox = () => {

    const [showMappedIn, setShowMappedIn] = useState(false);

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

    useEffect(() => {
        setTimeout(performAction, 5000);
    }, [])

    function performAction() {
        setShowMappedIn(true);
    }


    return (
        <div>
            <div ref={mapContainer} id='map' className='map transition' style={{opacity: showMappedIn ? '0' : '100' }}></div>
            <div className='transition' style={{opacity: showMappedIn ? '100' : '0' }}><MappedIn/></div>
        </div>
    )
}