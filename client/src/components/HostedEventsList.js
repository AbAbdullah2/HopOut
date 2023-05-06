import React, { useEffect, useState } from 'react';
import { getAllHostedEvents } from '../services/api';
import EventCardSmall from './EventCardSmall';

export default function MyEventsList(props) {
    const {curUser, self} = props;    
    
    const [pastEvents, setPastEvents] = useState([])
    const [currentEvents, setCurrentEvents] = useState([])

    useEffect(() => {
        // Update hosted events list  
        getAllHostedEvents(curUser._id).then((res) => {
            const displayedEvents = self ? res.data.data : res.data.data.filter((ev) => { return ev.visibility === "public"});

            const past = displayedEvents.filter((ev) => {
                const endDate = new Date(ev.end);
                const now = Date.now();
                return endDate < now;
            });
            setPastEvents(past);

            const current = displayedEvents.filter((ev) => {
                const endDate = new Date(ev.end);
                const now = Date.now();
                return endDate >= now;
            });
            setCurrentEvents(current);
        });
    }, [curUser, self]);

    return (
    <div className="rounded shadow bg-white">
    <div className="text-xl w-full px-4 py-2 border-b-2 font-semibold text-slate-900">Currently Hosting</div>

    <div className={'my-2 flex flex-col ' + (currentEvents.length > 0 ? 'md:grid md:grid-cols-3 items-center justify-center' : '')}>
        { 
        currentEvents.length > 0 ?
        
        currentEvents.map((event) => 
            <EventCardSmall event={event} key={event._id} />
        ) :
        <div className="flex-1 p-5">
            <p className="text-sm font-medium text-gray-900 dark:text-white">
                No events yet! 
            </p>
        </div>
        }
        
    </div>
    <div className="text-xl w-full px-4 py-2 border-b-2 font-semibold text-slate-900">Previously Hosted Events</div>

    <div className={'my-2 flex flex-col ' + (pastEvents.length > 0 ? 'md:grid md:grid-cols-3 items-center justify-center' : '')}>
        { 
        pastEvents.length > 0 ? 
        pastEvents.map((event) => 
            <EventCardSmall event={event} key={event._id} />
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