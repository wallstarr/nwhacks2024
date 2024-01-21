import { Mapbox } from './Mapbox';
import { MappedIn } from './MappedIn';

export const Main = () => {
    const lsiVenueMap = {
        name: "LIFE SCIENCE BUILDING UBC",
        address: "2350 Health Sciences Mall, Vancouver, BC V6T 1Z3",
        venue: {
            mapId: "657cc670040fcba69696e69e",
            key: "65a0422df128bbf7c7072349",
            secret: "5f72653eba818842c16c4fdb9c874ae02100ffced413f638b7bd9c65fd5b92a4",}
    }
    return (
        // <Mapbox style={{overflow: 'hidden'}}></Mapbox>
        <MappedIn venueMap={lsiVenueMap}></MappedIn>
    )
}