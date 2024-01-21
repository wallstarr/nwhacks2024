import { getVenue, showVenue, E_SDK_EVENT, TGetVenueMakerOptions, getVenueMaker } from '@mappedin/mappedin-js';
import '@mappedin/mappedin-js/lib/mappedin.css';
import { useEffect } from 'react';

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


    async function init() {
        const venue = await getVenueMaker(tsawwassen);
        const mapView = await showVenue(document.getElementById("app"), venue);
        mapView.FloatingLabels.labelAllLocations();
        mapView.addInteractivePolygonsForAllLocations();
        mapView.on(E_SDK_EVENT.CLICK, ({ polygons }) => {
            console.log(`Polygon with id ${polygons[0].id} clicked!`);
        });
    }

    useEffect(() => {
        init();
    })

    // document.addEventListener('DOMContentLoaded', init);

    return (
        <div className='app'></div>
    )
}

