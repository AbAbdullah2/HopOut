import React, { useEffect, useState } from 'react';

export default function MyEventsList(props) {
    const {curUser} = props;    
    const [events, setEvents] = useState([]);

    return (
    <div className="m-2 rounded overflow-hidden shadow">
    <div className="text-xl w-full px-4 py-2 border-b-2 font-semibold text-slate-900">Events</div>

    <div className="p-5">
    <ul className="max-w-md divide-y divide-gray-200 dark:divide-gray-700">
        { 
        events.length > 0 ? 
        events.map((friend) => 
            <li className="pb-3 sm:pb-4">
                <p>event</p>
            </li>
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
        
    </ul>
    </div>
    </div>
    )

}