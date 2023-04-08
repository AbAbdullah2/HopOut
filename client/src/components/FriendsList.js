import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro'
import { getAllUsers } from '../services/api';

export default function FriendsList(props) {
    const {curUser, triggerShow} = props;
    const navigate = useNavigate();
    const [friends, setFriends] = useState([]);

    useEffect(() => {
        // Update friend IDs
        const friendsIds = curUser.friends.reduce(
            (accumulator, currentValue) => accumulator.concat([currentValue.user]), [])

        // Update friends list 
        getAllUsers().then((res) => {
            const users = res.data.data.filter((u) => {return u._id !== curUser._id})
            setFriends(users.filter((u) => {return friendsIds.indexOf(u._id) !== -1}));
        });
    }, [curUser]); 
    
    return (
    <div className="rounded overflow-hidden shadow break-all bg-white">
    <div className="text-xl w-full px-4 py-2 border-b-2 font-semibold text-slate-900">Friends</div>

    <div className="p-5">
    <ul className="max-w-md divide-y divide-gray-200 dark:divide-gray-700">
        { 
        friends.length > 0 ? 
        friends.map((friend) => 
            <li key={friend._id} className="p-3 sm:pb-4 hover:bg-stone-100 hover:shadow-md">
                <div className="flex items-center space-x-4">
                    <div className="flex-1 min-w-0" onClick={() => navigate('/profile/'+friend._id)}>
                        <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                            {friend.name}
                        </p>
                        <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                            {friend.email}
                        </p>
                    </div>
                    <button className="inline-flex font-bold py-2 px-4 rounded-full" onClick={() => triggerShow(friend)}>
                        <FontAwesomeIcon icon={solid('xmark')} />
                    </button>
                </div>
            </li>
        ) :
        <div className="flex-1">
            <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                No friends yet! 
            </p>
        </div>
        }
    </ul>
    </div>
    </div>
    )
}