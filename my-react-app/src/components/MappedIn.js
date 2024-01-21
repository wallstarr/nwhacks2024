import { getVenue, showVenue, E_SDK_EVENT, TGetVenueMakerOptions, getVenueMaker } from '@mappedin/mappedin-js';
import '@mappedin/mappedin-js/lib/mappedin.css';
import { useEffect, useRef } from 'react';

export const MappedIn = () => {

    const lsi = {
        mapId: "657cc670040fcba69696e69e",
        key: "65a0422df128bbf7c7072349",
        secret: "5f72653eba818842c16c4fdb9c874ae02100ffced413f638b7bd9c65fd5b92a4",
    };

    const nest = {
        mapId: "659efcf1040fcba69696e7b6",
        key: "65a0422df128bbf7c7072349",
        secret: "5f72653eba818842c16c4fdb9c874ae02100ffced413f638b7bd9c65fd5b92a4",
    };

    const tsawwassen = {
        mapId: "65ac3a0eca641a9a1399dc23",
        key: "65ac4e9dca641a9a1399dc32",
        secret: "61bb58f5c0a8ceee5cd7ebf782c64713164e16726f5f3d71f7895928126ac310",
    };

    const mapViewRef = useRef(null); // useRef to keep track of the mapView

    async function init() {
        // Check if the map is already initialized
        if (!mapViewRef.current) {
            const venue = await getVenueMaker(lsi);
            mapViewRef.current = await showVenue(document.getElementById("mappedin-container"), venue);
            mapViewRef.current.FloatingLabels.labelAllLocations();
            mapViewRef.current.addInteractivePolygonsForAllLocations();

            mapViewRef.current.on(E_SDK_EVENT.CLICK, ({ polygons }) => {
                if (polygons.length > 0) {
                    mapViewRef.current.setPolygonColor(polygons[0], "#00A36C");
                } else {
                    mapViewRef.current.clearAllPolygonColors();
                }
            });

            mapViewRef.current.on(E_SDK_EVENT.CLICK, ({ position }) => {
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
                    (location) => location.name === "Bass Pro Shops"
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
            });
        }
    }

    useEffect(() => {
        init();
        console.log('MappedIn component mounted');
    }, []); // Empty dependency array

    return (
        <div id='mappedin-container'></div>
    );
}
