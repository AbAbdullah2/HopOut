import React, { useEffect, useState } from 'react';
import { getAllHostedEvents } from '../services/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro'
import { formatEventDates } from '../helpers/FormatDate';
import { useNavigate } from 'react-router-dom'

export default function MyEventsList(props) {
    const {curUser, self} = props;    
    const [events, setEvents] = useState([]);
    
    const [pastEvents, setPastEvents] = useState([])
    const [currentEvents, setCurrentEvents] = useState([])
    const navigate = useNavigate();

    // const [currentDateTime, setCurrentDateTime] = useState(new Date());

    // useEffect(() => {
    //     const intervalId = setInterval(() => {
    //     setCurrentDateTime(new Date());
    //     }, 1000);
    //     console.log("Current:", currentDateTime);
    //     return () => clearInterval(intervalId);
    // }, []);

    useEffect(() => {
        // Update hosted events list  
        getAllHostedEvents(curUser._id).then((res) => {
            const displayedEvents = self ? res.data.data : res.data.data.filter((ev) => { return ev.visibility === "public"});
            setEvents(displayedEvents);
            setPastEvents(displayedEvents.filter((ev) => {
                const endDate = new Date(ev.end);
                const now = Date.now();
                return endDate < now;
            }))
        });
        console.log(events);
    }, [curUser]); 


    return (
    <div className="rounded overflow-hidden shadow bg-white">
    <div className="text-xl w-full px-4 py-2 border-b-2 font-semibold text-slate-900">Currently Hosting</div>

    <div className='my-2 flex flex-col'>
        { 
        events.length > 0 ? 
        events.map((event) => 
            <div className="flex-grow my-2 mx-5 items-center text-center justify-center rounded-md flex flex-row hover:bg-gray-200 hover:cursor-pointer" onClick={()=> navigate('/events/'+ event._id)}>
                <div>
                    <img src={event.thumbnailId} alt={event.name} className='object-cover rounded-md w-32 h-32' />
                </div>
                <div className='w-full'>
                    <p className=''>{event.name}</p>
                    <p className='my-2'><FontAwesomeIcon icon={solid('calendar')} /> {formatEventDates(new Date(event.start), new Date(event.end))}</p>
                    <p><FontAwesomeIcon icon={solid('location-dot')} /> {event.locationName ? event.locationName : (event.location.city + ', ' + event.location.state + ' ' + event.location.zip)}</p>
                </div>
            </div>
        ) :
        <div className="flex-1 p-5">
            <p className="text-sm font-medium text-gray-900 dark:text-white">
                No events yet! 
            </p>
        </div>
        }
        
    </div>
    <div className="text-xl w-full px-4 py-2 border-b-2 font-semibold text-slate-900">Past Hosted Events</div>

    <div className='my-2 flex flex-col'>
        { 
        events.length > 0 ? 
        events.map((event) => 
            <div className="flex-grow my-2 mx-5 items-center text-center justify-center rounded-md flex flex-row hover:bg-gray-200 hover:cursor-pointer" onClick={()=> navigate('/events/'+ event._id)}>
                <div>
                    <img src={event.thumbnailId} alt={event.name} className='object-cover rounded-md w-32 h-32' />
                </div>
                <div className='w-full'>
                    <p className=''>{event.name}</p>
                    <p className='my-2'><FontAwesomeIcon icon={solid('calendar')} /> {formatEventDates(new Date(event.start), new Date(event.end))}</p>
                    <p><FontAwesomeIcon icon={solid('location-dot')} /> {event.locationName ? event.locationName : (event.location.city + ', ' + event.location.state + ' ' + event.location.zip)}</p>
                </div>
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