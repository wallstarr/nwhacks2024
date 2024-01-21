import { Mapbox } from './Mapbox';
import { MappedIn } from './MappedIn';

export const Main = () => {
    const lsiVenueMap = {
        name: "LIFE SCIENCE BUILDING UBC",
        address: "2350 Health Sciences Mall, Vancouver, BC V6T 1Z3",
        venue: {
            mapId: "657cc670040fcba69696e69e",
            key: "65a0422df128bbf7c7072349",
            secret: "5f72653eba818842c16c4fdb9c874ae02100ffced413f638b7bd9c65fd5b92a4",
        }
    }
    const tsawwassenMap = {
        name: "Tsawwassen Mills",
        venue: {
            mapId: "65ac3a0eca641a9a1399dc23",
            key: "65ac4e9dca641a9a1399dc32",
            secret: "61bb58f5c0a8ceee5cd7ebf782c64713164e16726f5f3d71f7895928126ac310",
        }
    }
    return (
        // <Mapbox style={{overflow: 'hidden'}}></Mapbox>
        <MappedIn venueMap={lsiVenueMap}></MappedIn>
    )
}