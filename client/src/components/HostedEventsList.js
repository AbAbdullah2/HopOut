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
    <div className="text-xl w-full px-4 py-2 border-b-2 font-semibold text-slate-900">Hosted Events</div>

    <div className='my-5 w-11/12 md:grid md:grid-cols-2 items-center justify-center'>
        { 
        events.length > 0 ? 
        events.map((event) => 
            <div className="max-w-sm">
                <EventCard event={event} map={false} />
            </div>
        ) :
        <div className="flex-1 p-5">
            <p className="text-sm font-medium text-gray-900 dark:text-white">
                No events yet! 
            </p>
        </div>
        }
        
    </div>
    </div>
    )

}