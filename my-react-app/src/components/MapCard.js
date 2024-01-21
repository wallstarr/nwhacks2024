import { useEffect, useState } from 'react';

export const MapCard = (props) => {

    function parseOpeningHours(opHrs) {
        let d = new Date();
        d = d.getDay();

        //the other API has their dates starting with Monday instead of Sunday
        d -= 1;

        if(d < 0)
            d = 6;   
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
                    {props.feature.address}
                </div>
                <div>
                    {parseOpeningHours(props.feature.openingHours)}
                </div>
                <div>
                    {props.feature.phoneNum}
                </div>
                <div>
                    {props.feature.website}
                </div>
            </div>
        </div>
    )
}