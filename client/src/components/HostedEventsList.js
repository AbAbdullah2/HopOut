import React, { useEffect, useState } from 'react';
import { getAllHostedEvents } from '../services/api';
import EventCard from './EventCard';

export default function MyEventsList(props) {
    const {curUser} = props;    
    const [events, setEvents] = useState([]);

    useEffect(() => {
        // Update hosted events list  
        getAllHostedEvents(curUser._id).then((res) => {
            console.log("res of allHostedEvents", res);
            console.log("setting events res.data.data", res.data.data);
            setEvents(res.data.data);
        });
        console.log("events;", events);
    }, [curUser]); 


    return (
    <div className="m-2 rounded overflow-hidden shadow">
    <div className="text-xl w-full px-4 py-2 border-b-2 font-semibold text-slate-900">Events</div>

    <div className='my-5 w-11/12 md:grid md:grid-cols-2 items-center justify-center'>

    {/* <div className="max-w-md divide-y divide-gray-200 dark:divide-gray-700"> */}
        { 
        events.length > 0 ? 
        events.map((event) => 
            <div className="max-w-sm">
                <EventCard event={event} map={false} />
            </div>
        ) :
        <div className="flex-1 min-w-0">

            <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                No events yet! 
            </p>
            <p className="text-sm font-medium text-gray-500 truncate dark:text-white">
                Search for users or see event invitees to add events. 
            </p>

        </div>
        }
        
    </div>
    </div>
    )

}