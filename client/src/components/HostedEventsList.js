import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro'
import { deleteFriend, getUser } from '../services/api';

export default function MyEventsList(props) {
    const {curUser} = props;    
    console.log("cur user organizing: ", curUser.organizing);
    return (
    <div>
    <ul className="max-w-md divide-y divide-gray-200 dark:divide-gray-700">
        {curUser.organizing.map((event) => 
            <li className="pb-3 sm:pb-4">
                <div className="flex items-center space-x-4">
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                            {event.name}
                        </p>
                    </div>
                    {/* <button className="inline-flex font-bold py-2 px-4 rounded-full" onClick={() => handleUnfriend(friend._id)}>
                        <FontAwesomeIcon icon={solid('xmark')} />
                    </button> */}
                </div>
            </li>
        )}
        
    </ul>
    </div>
    )
}