import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro'
import { removeFriend, getUser } from '../services/api';

export default function FriendsList(props) {
    const fakeFriends = [{
        _id: "8493",
        name: "Fake friend",
        email: "fake@jhu.edu"
    }, 
    {
        _id: "3492",
        name: "Fake friend",
        email: "fake@jhu.edu"
    }];

    const {curUser} = props;

    // Placeholder until api calls actually work
    curUser.friends = fakeFriends;
    const [friends, setFriends] = useState(curUser.friends);

    const handleUnfriend = (unfriendedId) => {
        console.log("deleting friend", unfriendedId);
        removeFriend(curUser, unfriendedId).then((res) => {
            console.log("delete response: ", res);
            // not sure if this is right
            // setFriends(res.data.friends);
        });
    }
    
    return (
    <div>
    <h1 className="font-semibold text-slate-900">Friends</h1>
    <ul className="max-w-md divide-y divide-gray-200 dark:divide-gray-700">
        {friends.map((friend) => 
            <li className="pb-3 sm:pb-4">
                <div className="flex items-center space-x-4">
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                            {friend.name}
                        </p>
                        <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                            {friend.email}
                        </p>
                    </div>
                    <button className="inline-flex font-bold py-2 px-4 rounded-full" onClick={() => handleUnfriend(friend._id)}>
                        <FontAwesomeIcon icon={solid('xmark')} />
                    </button>
                </div>
            </li>
        )}
        
    </ul>
    </div>
    )
}