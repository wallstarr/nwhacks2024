import { getVenue, showVenue, E_SDK_EVENT, TGetVenueMakerOptions, getVenueMaker } from '@mappedin/mappedin-js';
import '@mappedin/mappedin-js/lib/mappedin.css';
import { useEffect, useRef, useState } from 'react';
import './MappedIn.css'

export const MappedIn = (props) => {

    const mapViewRef = useRef(null);
    const containerRef = useRef(null);

    const [wayfindActive, setWayfindActive] = useState(false);
    const [venue, setVenue] = useState(null);

    const toggleWayfind = () => {
        setWayfindActive(!wayfindActive);
        // Additional logic for Wayfind can be added here
    };

    const handlePolygonClick = (polygons) => {
        if (polygons.length > 0) {
            mapViewRef.current.setPolygonColor(polygons[0], "#00A36C");
        } else {
            mapViewRef.current.clearAllPolygonColors();
        }
    };

    const handlePositionClick = async (position) => {
        const coordinate = mapViewRef.current.currentMap.createCoordinate(
            position.latitude,
            position.longitude
        );

        const nearestNode = coordinate.nearestNode;
        if (!nearestNode) {
            console.error('Nearest node not found');
            return;
        }

        const endLocation = venue.locations.find(
            (location) => location.name === "ICBC"
        );

        if (!endLocation) {
            console.error('End location not found');
            return;
        }

        try {
            const directions = nearestNode.directionsTo(endLocation);
            mapViewRef.current.Journey.draw(directions);
        } catch (error) {
            console.error('Error getting directions:', error);
        }
    };

    const updateEventListeners = () => {
        if (mapViewRef.current) {
            mapViewRef.current.off(E_SDK_EVENT.CLICK); // Remove existing click event listeners

            // Add the appropriate event listener based on wayfindActive state
            if (wayfindActive) {
                mapViewRef.current.on(E_SDK_EVENT.CLICK, ({ position }) => handlePositionClick(position));
            } else {
                mapViewRef.current.on(E_SDK_EVENT.CLICK, ({ polygons }) => handlePolygonClick(polygons));
            }
        }
    };

    const init = async () => {
        if (!mapViewRef.current) {
            const fetchedVenue = await getVenueMaker(props.venueMap.venue);
            setVenue(fetchedVenue); // Store the fetched venue in state
            mapViewRef.current = await showVenue(containerRef.current, fetchedVenue);
            mapViewRef.current.FloatingLabels.labelAllLocations();
            mapViewRef.current.addInteractivePolygonsForAllLocations();
        }
    };

    useEffect(() => {
        init();
        return () => {
            // Cleanup if necessary
        };
    }, []);

    useEffect(() => {
        updateEventListeners();
    }, [wayfindActive, venue]);

    return (
        <div className="mappedin-wrapper">
            <div className='mappedin-container' ref={containerRef}></div>
            <button
                className="wayfind-button"
                onClick={toggleWayfind}
                style={{
                    backgroundColor: wayfindActive ? 'orange' : 'green',
                }}
            >
                {wayfindActive ? 'Cancel' : 'Wayfind'}
            </button>
        </div>
    );
};