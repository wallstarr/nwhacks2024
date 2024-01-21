import { getVenue, showVenue, E_SDK_EVENT, TGetVenueMakerOptions, getVenueMaker } from '@mappedin/mappedin-js';
import '@mappedin/mappedin-js/lib/mappedin.css';
import { useEffect, useRef, useState } from 'react';
import './MappedIn.css'

export const MappedIn = (props) => {

    const mapViewRef = useRef(null);
    const containerRef = useRef(null);

    const handlePolygonClick = (polygons) => {
        if (polygons.length > 0) {
            mapViewRef.current.setPolygonColor(polygons[0], "#00A36C");
        } else {
            mapViewRef.current.clearAllPolygonColors();
        }
    };

    const handlePositionClick = async (position, venue) => {
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

    const init = async () => {
        if (!mapViewRef.current) {
            // prop from parent should include this as our previous version of lsi/nest/tsawwassen
            const venue = await getVenueMaker(props.venueMap.venue);
            mapViewRef.current = await showVenue(containerRef.current, venue);
            mapViewRef.current.FloatingLabels.labelAllLocations();
            mapViewRef.current.addInteractivePolygonsForAllLocations();

            mapViewRef.current.on(E_SDK_EVENT.CLICK, ({ polygons }) => handlePolygonClick(polygons));
            mapViewRef.current.on(E_SDK_EVENT.CLICK, ({ position }) => handlePositionClick(position, venue));
        }
    };

    useEffect(() => {
        init();
        return () => {
            // Cleanup if necessary
        };
    }, []);

    return (
        <>
            <div className='mappedin-container' ref={containerRef} style={{display: "flex"}}>
                <div style={{background: "white", color: "black", position: "fixed", top: 0, left: 0, width: 450}}>{props.venueMap.name}</div>
                <div style={{background: "white", color: "black", position: "fixed", top: 25, left: 0, width: 450}}>{props.venueMap.address}</div>
            </div>
        </>

    );
};