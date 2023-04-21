import React, { useEffect, useState } from 'react';
import { getAllHostedEvents } from '../services/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro'
import { formatEventDates } from '../helpers/FormatDate';
import { useNavigate } from 'react-router-dom'

export default function MyEventsList(props) {
    const {curUser, self} = props;    
    
    const [pastEvents, setPastEvents] = useState([])
    const [currentEvents, setCurrentEvents] = useState([])
    const navigate = useNavigate();

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

    const computeRating = (reviews) => {;
        const sum = reviews.map((rev) => {return rev.rating}).reduce((acc, curr) => {return acc + curr}, 0);
        if (sum === 0) {
            return 0;
        }
        return Math.round(sum / reviews.length * 10) / 10;
    };

    return (
    <div className="rounded overflow-hidden shadow bg-white">
    <div className="text-xl w-full px-4 py-2 border-b-2 font-semibold text-slate-900">Currently Hosting</div>

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
                No events yet! 
            </p>
        </div>
        }
        
    </div>
    <div className="text-xl w-full px-4 py-2 border-b-2 font-semibold text-slate-900">Previously Hosted Events</div>

    <div className='my-2 flex flex-col'>
        { 
        pastEvents.length > 0 ? 
        pastEvents.map((event) => 
            <div key={event._id} className="flex-grow my-2 mx-5 items-center text-center justify-center rounded-md flex flex-row hover:bg-gray-200 hover:cursor-pointer" onClick={()=> navigate('/events/'+ event._id)}>
                <div>
                    <img src={event.thumbnailId} alt={event.name} className='object-cover rounded-md w-32 h-32' />
                </div>
                <div className='w-full py-4'>
                    <p className=''>{event.name}</p>
                    <p className='my-2'><FontAwesomeIcon icon={solid('calendar')} /> {formatEventDates(new Date(event.start), new Date(event.end))}</p>
                    <p><FontAwesomeIcon icon={solid('location-dot')} /> {event.locationName ? event.locationName : (event.location.city + ', ' + event.location.state + ' ' + event.location.zip)}</p>
                    <div className="flex flex-row text-center items-center justify-center mt-2">
                        <svg aria-hidden="true" className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><title>Rating star</title><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                        <p className="ml-2 text-sm font-bold text-gray-900 dark:text-white">{computeRating(event.reviews)}</p>
                        <span className="w-1 h-1 mx-1.5 bg-gray-500 rounded-full dark:bg-gray-400"></span>
                        <span className="text-sm font-medium text-gray-900 hover:no-underline dark:text-white">{event.reviews.length} {event.reviews.length === 1 ? "rating" : "ratings"}</span>
                    </div>
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