import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import axios from 'axios';
import './Mapbox.css'
import "mapbox-gl/dist/mapbox-gl.css";
import { MapCard } from './MapCard';

export const Mapbox = () => {

    const mapContainer = useRef(null);
    const map = useRef(null);
    const placesData = useRef(null)
    const [selectedPlaceDetails, setSelectedPlaceDetails] = useState(null); // State to store selected place details
    useEffect(() => {

        if (map.current) return;
        mapboxgl.accessToken = 'pk.eyJ1IjoibWF4aW11c2w1OSIsImEiOiJjbHJtandqdXQwd2dvMmpvZnphOHRvMm9jIn0.XMUyvUmW_sGAUEugPnjTxg';
        map.current = new mapboxgl.Map({
            container: mapContainer.current, // container ID
            style: 'mapbox://styles/mapbox/dark-v11', // style URL
            center: [-123.117, 49.238], // starting position [lng, lat]
            zoom: 12, // starting zoom
        });

        axios.get('http://localhost:3000/places-coordinates')
        .then(response => {
            placesData.current = response.data
            // Ensure the map instance is available
            if (!map.current) return;
            addMarkersToMap(placesData.current);
        })
        .catch(error => console.error('Error fetching data: ', error));

        
    });

    const addMarkersToMap = (placesData) => {
        console.log(placesData)
        placesData.forEach(place => {
            const marker = new mapboxgl.Marker()
                .setLngLat([place.longitude, place.latitude])
                .addTo(map.current);

            marker.getElement().addEventListener('click', () => {
                console.log("here")
                fetchPlaceDetailsById(place.placeId); // Fetch details when marker is clicked
            });
         });
    };

    const fetchPlaceDetailsById = (placeId) => {
        axios.get(`http://localhost:3000/place-details?placeId=${placeId}`)
            .then(res => {
                setSelectedPlaceDetails(res.data); // Update state with fetched details
            })
            .catch(error => console.error(`Error fetching details: `, error));
    };

    return (
        <div>
            <div ref={mapContainer} id='map' className='map' style={{width: '100vw', height: '100vh'}}/>
            {selectedPlaceDetails && <MapCard feature={selectedPlaceDetails} />}
        </div>
    )
}