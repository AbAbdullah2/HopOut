import React, { useEffect, useState } from 'react';
import { getAllAttendedEvents } from '../services/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro'
import { formatEventDates } from '../helpers/FormatDate';
import { useNavigate } from 'react-router-dom'

export default function MyEventsList(props) {
    const {curUser} = props;    
    const navigate = useNavigate();

    const [pastEvents, setPastEvents] = useState([])
    const [currentEvents, setCurrentEvents] = useState([])

    useEffect(() => {
        // Update hosted events list  
        getAllAttendedEvents(curUser._id).then((res) => {
            const displayedEvents = res.data.data;

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
    }, [curUser]);

    return (
    <div className="rounded overflow-hidden shadow bg-white">
    <div className="text-xl w-full px-4 py-2 border-b-2 font-semibold text-slate-900">Planning To Attend</div>

    <div className='my-2 flex flex-col'>
        { 
        currentEvents.length > 0 ? 
        currentEvents.map((event) => 
            <div key={event._id} className="flex-grow my-2 mx-5 items-center text-center justify-center rounded-md flex flex-row hover:bg-gray-200 hover:cursor-pointer" onClick={()=> navigate('/events/'+ event._id)}>
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
                You have not attended any events. Check out the events page!
            </p>
        </div>
        }
        
    </div>

    <div className="text-xl w-full px-4 py-2 border-b-2 font-semibold text-slate-900">Previously Attended Events</div>

    <div className='my-2 flex flex-col'>
        { 
        pastEvents.length > 0 ? 
        pastEvents.map((event) => 
            <div key={event._id} className="flex-grow my-2 mx-5 items-center text-center justify-center rounded-md flex flex-row hover:bg-gray-200 hover:cursor-pointer" onClick={()=> navigate('/events/'+ event._id)}>
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
                You have not attended any events. Check out the events page!
            </p>
        </div>
        }
        
    </div>
    </div>
    )

}