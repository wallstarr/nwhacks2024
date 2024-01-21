import React, { useEffect, useRef, useState } from "react";
import ReactDOM from 'react-dom/client';
import mapboxgl from "mapbox-gl";
import axios from "axios";
import "./Mapbox.css";
import "mapbox-gl/dist/mapbox-gl.css";
import { MapCard } from "./MapCard";
import { MappedIn } from "./MappedIn";
import buildingMeta from "./buildingmeta.json"

export const Mapbox = () => {
    const [showMappedIn, setShowMappedIn] = useState(false);

    const mapContainer = useRef(null);
    const map = useRef(null);
    let detailsDict = {}

    const placesData = useRef(null);
    const [selectedPlaceDetails, setSelectedPlaceDetails] = useState(null); // State to store selected place details
    const [venueMap, setVenueMap] = useState({
        "name": "Djavad Mowafaghian Centre for Brain Health",
        "address": "2215 Wesbrook Mall, Vancouver, BC V6T 1Z3",
        "venue": {
            "mapId": "65ac802904c23e7916b1d0f6",
            "key": "65a0422df128bbf7c7072349",
            "secret": "5f72653eba818842c16c4fdb9c874ae02100ffced413f638b7bd9c65fd5b92a4"
        }
    })

    const jumpIntoBuilding = (targetName) => {
        const filteredJson = buildingMeta.filter((jsonObject) => jsonObject.name === targetName);
        setVenueMap(filteredJson[0]);
        // console.log(venueMap)
        setShowMappedIn(true);
    }

    const jumpOutOfBuilding = () => {
        setShowMappedIn(false);
    }

    useEffect(() => {
        if (map.current) return;
        mapboxgl.accessToken =
            "pk.eyJ1IjoibWF4aW11c2w1OSIsImEiOiJjbHJtandqdXQwd2dvMmpvZnphOHRvMm9jIn0.XMUyvUmW_sGAUEugPnjTxg";
        map.current = new mapboxgl.Map({
            container: mapContainer.current, // container ID
            style: "mapbox://styles/mapbox/streets-v12", // style URL
            center: [-123.2501, 49.2676], // starting position [lng, lat]
            zoom: 13, // starting zoom
        });
    });

    useEffect(() => {
        axios
            .get("http://localhost:3001/places-coordinates")
            .then((response) => {
                placesData.current = response.data;
                fetchAllPlaceDetails(placesData.current);
                // Ensure the map instance is available
                // if (!map.current) return;
                // addMarkersToMap(placesData.current);
            })
            .catch((error) => console.error("Error fetching data: ", error));
    }, [])

    const fetchAllPlaceDetails = (places) => {
        const detailPromises = places.map(place =>
            axios.get(`http://localhost:3001/place-details?placeId=${place.placeId}`)
                .then(res => ({ placeId: place.placeId, details: res.data }))
                .catch(error => {
                    console.error(`Error fetching details for placeId ${place.placeId}:`, error);
                    return { placeId: place.placeId, details: null }; // Handle error for individual place
                })
        );

        axios.all(detailPromises)
            .then(responses => {
                detailsDict = {};
                responses.forEach(response => {
                    if (response) {
                        detailsDict[response.placeId] = response.details;
                    }
                });
                // placesData.current = detailsDict; // Update placesData with detailed info in a dictionary
                addMarkersToMap(Object.values(placesData.current)); // Now add markers to map
            })
            .catch(error => console.error('Error fetching place details:', error));
    };

    const addMarkersToMap = (placesData) => {
        placesData.forEach((place) => {
            const marker = new mapboxgl.Marker({ anchor: 'bottom' })
                .setLngLat([place.longitude, place.latitude])
                .addTo(map.current);

            const filteredJson = detailsDict[place.placeId];

            const divElem = document.createElement("div");
            SetCardDetails(divElem, filteredJson);

            const popup = new mapboxgl.Popup({
                offset: 50,
                anchor: "left",
                className: "popup",
            })
                .setDOMContent(divElem);

            marker.setPopup(popup);
        });
    };

    function SetCardDetails(divElem, filteredJson) {
        const card = ReactDOM.createRoot(divElem);
        card.render(
            <MapCard
                zoomIn={jumpIntoBuilding}
                feature={filteredJson}
            />
        );
    }

    return (
        <div>
            <div
                ref={mapContainer}
                id="map"
                className="map transition"
                style={{ display: showMappedIn ? "none" : "inherit" }}
            ></div>
            <div className='transition' style={{ display: showMappedIn ? 'inherit' : 'none' }}><MappedIn venueMap={venueMap} jumpOut={jumpOutOfBuilding}/></div>
        </div>
    );
};
