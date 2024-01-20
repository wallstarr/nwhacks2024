import {
    getVenueMaker,
    showVenue,
    TGetVenueMakerOptions,
    E_SDK_EVENT
} from "@mappedin/mappedin-js";
import "@mappedin/mappedin-js/lib/mappedin.css";

// See Trial API key Terms and Conditions
// https://developer.mappedin.com/guides/api-keys
const lsi: TGetVenueMakerOptions = {
    mapId: "657cc670040fcba69696e69e",
    key: "65a0422df128bbf7c7072349",
    secret: "5f72653eba818842c16c4fdb9c874ae02100ffced413f638b7bd9c65fd5b92a4",
};

const nest: TGetVenueMakerOptions = {
    mapId: "659efcf1040fcba69696e7b6",
    key: "65a0422df128bbf7c7072349",
    secret: "5f72653eba818842c16c4fdb9c874ae02100ffced413f638b7bd9c65fd5b92a4",
};

const tsawwassen: TGetVenueMakerOptions = {
    mapId: "65ac3a0eca641a9a1399dc23",
    key: "65ac4e9dca641a9a1399dc32",
    secret: "61bb58f5c0a8ceee5cd7ebf782c64713164e16726f5f3d71f7895928126ac310",
};

async function init() {
    const venue = await getVenueMaker(tsawwassen);
    const mapView = await showVenue(document.getElementById("app")!, venue);
    mapView.addInteractivePolygonsForAllLocations();

    mapView.addInteractivePolygonsForAllLocations();

    //Capture when the user clicks on a polygon.
    //The polygon that was clicked on is passed into the on method.
    mapView.on(E_SDK_EVENT.CLICK, ({ polygons }) => {
        //If no polygon was clicked, an empty array is passed.
        //Check the length to verify if the user cliked on one.
        //If they clicked on a polygon, change its color to orange,
        //otherwise reset them to their default color.
        if (polygons.length > 0) {
            mapView.setPolygonColor(polygons[0], "#BF4320");
        } else {
            mapView.clearAllPolygonColors();
        }   
    });
}

init();