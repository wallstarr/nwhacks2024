import { useEffect, useState } from 'react';

export const MapCard = (props) => {

    function parseOpeningHours(opHrs) {
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
            <button className='' onClick={() => {
                }}>
                    Jump into building
            </button>
            <div>
                <h2>
                    {props.feature.name}
                </h2>
                <div>
                    {props.feature.formatted_address}
                </div>
                <div>
                    {parseOpeningHours(props.feature.opening_hours.weekday_text)}
                </div>
                <div>
                    {props.feature.formatted_phone_number}
                </div>
                <div>
                    {props.feature.website}
                </div>
            </div>
        </div>
    )
}