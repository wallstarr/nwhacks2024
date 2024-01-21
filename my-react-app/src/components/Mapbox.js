import React, { useEffect, useRef, useState } from "react";
import ReactDOM from 'react-dom/client';
import mapboxgl from "mapbox-gl";
import axios from "axios";
import "./Mapbox.css";
import "mapbox-gl/dist/mapbox-gl.css";
import { MapCard } from "./MapCard";
import { MappedIn } from "./MappedIn";

export const Mapbox = () => {
    const [showMappedIn, setShowMappedIn] = useState(false);

    const mapContainer = useRef(null);
    const map = useRef(null);

    const placesData = useRef(null);
    const [selectedPlaceDetails, setSelectedPlaceDetails] = useState(null); // State to store selected place details

    const jumpIntoBuilding = () => {
        setShowMappedIn(true);
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
                // Ensure the map instance is available
                if (!map.current) return;
                addMarkersToMap(placesData.current);
            })
            .catch((error) => console.error("Error fetching data: ", error));
    }, [])

    const addMarkersToMap = (placesData) => {
        console.log(placesData);
        placesData.forEach((place) => {
            const marker = new mapboxgl.Marker({ anchor: 'bottom' })
                .setLngLat([place.longitude, place.latitude])
                .addTo(map.current);

            const divElem = document.createElement("div");
            SetCardDetails(divElem, marker);

            const popup = new mapboxgl.Popup({
                offset: 50,
                anchor: "left",
                className: "popup",
            })
                .setDOMContent(divElem);

            marker.setPopup(popup);

            marker.getElement().addEventListener("click", () => {
                fetchPlaceDetailsById(place.placeId); // Fetch details when marker is clicked
            });
        });
    };

    const fetchPlaceDetailsById = (placeId) => {
        axios
            .get(`http://localhost:3001/place-details?placeId=${placeId}`)
            .then((res) => {
                setSelectedPlaceDetails(res.data); // Update state with fetched details
            })
            .catch((error) => console.error("Error fetching details:", error));
    };

    function SetCardDetails(divElem) {
        const card = ReactDOM.createRoot(divElem);
        card.render(
            <MapCard
                zoomIn={jumpIntoBuilding}
                feature={{"formatted_address": "2350 Health Sciences Mall, Vancouver, BC V6T 1Z3, Canada", "formatted_phone_number": "(604) 827-4128", "name": "Life Sciences Institute", "opening_hours": { "open_now": false, "periods": [{ "close": { "day": 1, "time": "1630" }, "open": { "day": 1, "time": "0830" } }, { "close": { "day": 2, "time": "1630" }, "open": { "day": 2, "time": "0830" } }, { "close": { "day": 3, "time": "1630" }, "open": { "day": 3, "time": "0830" } }, { "close": { "day": 4, "time": "1630" }, "open": { "day": 4, "time": "0830" } }, { "close": { "day": 5, "time": "1630" }, "open": { "day": 5, "time": "0830" } }], "weekday_text": ["Monday: 8:30 AM - 4:30 PM", "Tuesday: 8:30 AM - 4:30 PM", "Wednesday: 8:30 AM - 4:30 PM", "Thursday: 8:30 AM - 4:30 PM", "Friday: 8:30 AM - 4:30 PM", "Saturday: Closed", "Sunday: Closed"] }, "website": "http://lsi.ubc.ca/" }}
            />
        );
    }

    const lsiVenueMap = {
        name: "Tsawwassen Mills",
        venue: {
            mapId: "65ac3a0eca641a9a1399dc23",
            key: "65ac4e9dca641a9a1399dc32",
            secret: "61bb58f5c0a8ceee5cd7ebf782c64713164e16726f5f3d71f7895928126ac310",
        }
    }

    return (
        <div>
            <div
                ref={mapContainer}
                id="map"
                className="map transition"
                style={{ display: showMappedIn ? "none" : "inherit" }}
            ></div>
            <div className='transition' style={{ display: showMappedIn ? 'inherit' : 'none' }}><MappedIn venueMap={lsiVenueMap}/></div>
        </div>
    );
};
