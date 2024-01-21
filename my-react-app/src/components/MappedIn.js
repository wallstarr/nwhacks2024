import { showVenue, E_SDK_EVENT, getVenueMaker } from '@mappedin/mappedin-js';
import '@mappedin/mappedin-js/lib/mappedin.css';
import { useEffect, useRef, useState } from 'react';
import './MappedIn.css'

export const MappedIn = (props) => {

    const mapViewRef = useRef(null);
    const containerRef = useRef(null);

    const [wayfindActive, setWayfindActive] = useState(false);
    const [venue, setVenue] = useState(null);
    const [selectedDestination, setSelectedDestination] = useState('');
    const [departureLocation, setDepartureLocation] = useState('');
    const [distance, setDistance] = useState(0);
    const [isAccessibilityMode, setIsAccessibilityMode] = useState(false);
    const [isTooltipVisible, setIsTooltipVisible] = useState(false);


    // Function to handle selection change
    const handleDestinationChange = (event) => {
        setSelectedDestination(event.target.value);
    };

    const handleAccessibilityChange = (event) => {
        setIsAccessibilityMode(!isAccessibilityMode);
    };

    const handleTooltipsChange = (event) => {
        setIsTooltipVisible(!isTooltipVisible);
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
        setDepartureLocation(nearestNode);
        if (!nearestNode) {
            console.error('Nearest node not found');
            return;
        }

        if (!venue || !venue.locations) {
            console.error('Venue data not available');
            return;
        }

        const endLocation = venue.locations.find(
            (location) => location.name === selectedDestination
        );

        if (!endLocation) {
            console.error('End location not found');
            return;
        }

        try {
            const directions = nearestNode.directionsTo(endLocation);
            mapViewRef.current.Journey.draw(directions, {
                pathOptions: {
                    nearRadius: 1,
                    farRadius: 1,
                },
                accessible: true,
            });
            if (isTooltipVisible) {
                directions.instructions.forEach((instruction) => {
                    mapViewRef.current.createTooltip(
                        instruction.node,
                        `<span style="background-color: azure; padding:0.2rem; font-size:0.7rem">${instruction.instruction}</span>`
                    );
                });
            }
        } catch (error) {
            console.error('Error getting directions:', error);
        }
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
            mapViewRef.current = await showVenue(containerRef.current, fetchedVenue, {
                multiBufferRendering: true,
                outdoorView: {
                    enabled: true,
                    headers: {
                        'x-mappedin-tiles-key': 'bndoYWNrc3htYXBwZWRpbg',
                    },
                },
            });
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
    }, [wayfindActive, selectedDestination]);

    useEffect(() => {
        // Check if departureLocation and selectedDestination are available
        if (departureLocation && selectedDestination) {
            mapViewRef.current.Paths.removeAll();
            mapViewRef.current.removeAllTooltips();
            if (!venue || !venue.locations) {
                console.error('Venue data not available');
                return;
            }
            const endLocation = venue.locations.find(
                (location) => location.name === selectedDestination
            );

            // Ensure endLocation is found
            if (endLocation) {
                const directions = departureLocation.directionsTo(endLocation);
                mapViewRef.current.Journey.draw(directions, (directions, {
                    pathOptions: {
                        nearRadius: 1,
                        farRadius: 1,
                    },
                    accessible: isAccessibilityMode,
                }));
                if (isTooltipVisible) {
                    directions.instructions.forEach((instruction) => {
                        mapViewRef.current.createTooltip(
                            instruction.node,
                            `<span style="background-color: azure; font-size:0.7rem">${instruction.instruction}</span>`
                        );
                    });
                }
                setDistance(directions.distance)
            }
        }
    }, [selectedDestination, departureLocation, isAccessibilityMode, isTooltipVisible, venue]);

    return (
        <div className="mappedin-wrapper">
            <div className='mappedin-container' ref={containerRef}></div>

            <button className="back-button" onClick={() => { props.jumpOut() }}>Back</button>

            <button
                className="wayfind-button"
                onClick={() => setWayfindActive(!wayfindActive)}
                style={{
                    backgroundColor: wayfindActive ? 'orange' : 'green',
                }}
            >
                {wayfindActive ? 'Stop' : 'Wayfind'}
            </button>
            <div className="destination-selector">
                <select onChange={handleDestinationChange} value={selectedDestination}>
                    <option value="">Select a destination</option>
                    {venue && venue.locations
                        .filter(location => !location.name.toLowerCase().startsWith('unnamed'))
                        .map(location => (
                            <option key={location.id} value={location.name}>{location.name}</option>
                        ))}
                </select>
            </div>
            <div className="accessibility-slider">
                <label htmlFor="accessibilityMode">♿</label>
                <input
                    type="checkbox"
                    id="accessibilityMode"
                    checked={isAccessibilityMode}
                    onChange={handleAccessibilityChange}
                />
            </div>
            <div className="tooltip-slider">
                <label htmlFor="tooltipsMode">🧭</label>
                <input
                    type="checkbox"
                    id="tooltipsMode"
                    checked={isTooltipVisible}
                    onChange={handleTooltipsChange}
                />
            </div>
            <div className='title'>{props.venueMap.name}</div>
            <div className='addy'>
                <h6>{props.venueMap.address}</h6></div>
            <div className='distance'>{Math.round(distance) + "m"}</div>
        </div>


    );
};

