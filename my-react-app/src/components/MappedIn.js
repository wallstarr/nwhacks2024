import { getVenue, showVenue, E_SDK_EVENT, TGetVenueMakerOptions, getVenueMaker } from '@mappedin/mappedin-js';
import '@mappedin/mappedin-js/lib/mappedin.css';
import { useEffect, useRef, useState } from 'react';
import './MappedIn.css'

export const MappedIn = (props) => {

    const mapViewRef = useRef(null);
    const containerRef = useRef(null);

    const [wayfindActive, setWayfindActive] = useState(false);
    const [venue, setVenue] = useState(null);
    const [selectedDestination, setSelectedDestination] = useState('');

    // Function to handle selection change
    const handleDestinationChange = (event) => {
        setSelectedDestination(event.target.value);
        console.log("newDestination: " + selectedDestination);
    };

    const handlePolygonClick = (polygons) => {
        console.log(venue.locations);
        if (polygons.length > 0) {
            mapViewRef.current.setPolygonColor(polygons[0], "#00A36C");
        } else {
            mapViewRef.current.clearAllPolygonColors();
        }
    };

    const handlePositionClick = async (position) => {
        console.log("Handling position click");
        const coordinate = mapViewRef.current.currentMap.createCoordinate(
            position.latitude,
            position.longitude
        );

        const nearestNode = coordinate.nearestNode;
        if (!nearestNode) {
            console.error('Nearest node not found');
            return;
        }

        console.log("selectedDestination: " + selectedDestination)

        const endLocation = venue.locations.find(
            (location) => location.name === selectedDestination
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
        mapViewRef.current._subscribers.CLICK = []
    };

    const handleClick = (event) => {
        if (wayfindActive) {
            // Handle as position click
            handlePositionClick(event.position);
        } else {
            // Handle as polygon click
            handlePolygonClick(event.polygons);
        }
    };

    const init = async () => {
        if (!mapViewRef.current) {
            const fetchedVenue = await getVenueMaker(props.venueMap.venue);
            setVenue(fetchedVenue); // Store the fetched venue in state
            mapViewRef.current = await showVenue(containerRef.current, fetchedVenue);
            mapViewRef.current.FloatingLabels.labelAllLocations();
            mapViewRef.current.addInteractivePolygonsForAllLocations();
            mapViewRef.current.on(E_SDK_EVENT.CLICK, handleClick);
        }
    };

    useEffect(() => {
        init();
        return () => {
            if (mapViewRef.current) {
                mapViewRef.current.off(E_SDK_EVENT.CLICK);
            }
        };
    }, []);

    useEffect(() => {
        if (mapViewRef.current) {
            mapViewRef.current._subscribers.CLICK = []

            if (wayfindActive) {
                mapViewRef.current.on(E_SDK_EVENT.CLICK, ({ position }) => handlePositionClick(position));
            } else {
                mapViewRef.current.Paths.removeAll();
                mapViewRef.current.on(E_SDK_EVENT.CLICK, ({ polygons }) => handlePolygonClick(polygons));
            }
        }
    }, [wayfindActive]);

    return (
        <div className="mappedin-wrapper">
            <div className='mappedin-container' ref={containerRef}></div>
            <button
                className="wayfind-button"
                onClick={() => setWayfindActive(!wayfindActive)}
                style={{
                    backgroundColor: wayfindActive ? 'orange' : 'green',
                }}
            >
                {wayfindActive ? 'Cancel' : 'Wayfind'}
            </button>
            <div className="destination-selector">
                <select onChange={handleDestinationChange} value={selectedDestination}>
                    <option value="">Select a destination</option>
                    {venue && venue.locations.map(location => (
                        <option key={location.id} value={location.name}>{location.name}</option>
                    ))}
                </select>
            </div>
        </div>
    );
};