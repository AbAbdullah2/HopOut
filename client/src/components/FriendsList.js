import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro'
import { removeFriend, getUser, getAllUsers } from '../services/api';

export default function FriendsList(props) {

    const {curUser, setCurUser} = props;

    const [friends, setFriends] = useState([]);

    const handleUnfriend = (unfriended) => {
        removeFriend(curUser._id, unfriended._id).then((res) => {
            console.log("response: ", res);
            if (res.status === 201 || res.status === 200) {
                setCurUser(res.data.data);
            } else {
              console.log('Could not unfriend user ' + unfriended.name);
            }
    
        });
        
    }  

    useEffect(() => {
        // Update friend IDs
        const friendsIds = curUser.friends.reduce(
            (accumulator, currentValue) => accumulator.concat([currentValue.user]), [])

        // Update friends list 
        getAllUsers().then((res) => {
            const users = res.data.data.filter((u) => {return u._id !== curUser._id})
            setFriends(users.filter((u) => {return friendsIds.indexOf(u._id) != -1}));
        });
        console.log("friends;", friends);
      }, [curUser]); 
    
    return (
    <div className="m-2 rounded overflow-hidden shadow">
    <div className="text-xl w-full px-4 py-2 border-b-2 font-semibold text-slate-900">Friends</div>

    <div className="p-5">
    <ul className="max-w-md divide-y divide-gray-200 dark:divide-gray-700">
        { 
        friends.length > 0 ? 
        friends.map((friend) => 
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
                    <button className="inline-flex font-bold py-2 px-4 rounded-full" onClick={() => handleUnfriend(friend)}>
                        <FontAwesomeIcon icon={solid('xmark')} />
                    </button>
                </div>
            </li>
        ) :
        <div className="flex-1 min-w-0">

            <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                No friends yet! 
            </p>
            <p className="text-sm font-medium text-gray-500 truncate dark:text-white">
                Search for users or see event invitees to add friends. 
            </p>

        </div>
        }
        
    </ul>
    </div>
    </div>
    )
}