import { useEffect, useState } from 'react';
import "./MapCard.css"

export const MapCard = (props) => {

    function parseOpeningHours() {
        if(!props.feature.opening_hours) return;
        const opHrs = props.feature.opening_hours.weekday_text;

        let d = new Date();
        d = d.getDay();

        //the other API has their dates starting with Monday instead of Sunday
        d -= 1;

        if(d < 0)
            d = 6; 

        return opHrs[d];  
    }

    useEffect(() => {
    }, [props.feature]);

    return (
        <div className='card'>
            <button className='jump' onClick={() => {props.zoomIn(props.feature.name)}}>
                    View Building Map!
            </button>
            <div>
                <h2>
                    {props.feature.name}
                </h2>
                <div>
                    {props.feature.formatted_address}
                </div>
                <div>
                    {parseOpeningHours()}
                </div>
                <div>
                    {props.feature.formatted_phone_number}
                </div>
                <div>
                <a href={props.feature.website}>{props.feature.website}</a>
                </div>
            </div>
        </div>
    )
}