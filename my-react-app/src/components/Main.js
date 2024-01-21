import { Mapbox } from './Mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MappedIn } from './MappedIn';

export const Main = () => {

    return (
        <Mapbox style={{overflow: 'hidden'}}></Mapbox>
    )
}