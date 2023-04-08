import { Dropdown } from 'flowbite-react'
import { useState, useEffect } from 'react';
import { getAllUsers, getAllPublicEvents } from '../services/api'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { useNavigate } from 'react-router-dom'

export default function Notifications(props) {
  const {curUser} = props;
  const navigate = useNavigate();
  const [allNotifications, setAllNotifications] = useState([]);

  const [friendReqs, setFriendReqs] = useState([]);
  const [eventInvites, setEventInvites] = useState([]);

  useEffect(() => {
    getAllUsers().then(userData => {
      let reqs = [];
      userData.data.data.forEach((user) => {
        curUser.receivedFriends.forEach(received => {
          if(received.user === user._id) reqs.push(user);
        });
      });
      setFriendReqs(reqs);
    });

    getAllPublicEvents().then(eventData => {
        setEventInvites(eventData.data.data.filter(function (event) {
            return (curUser.invited.includes(event._id));
        }));
    });

  }, [curUser]);

  useEffect(() => {
    const friendReqsMap = friendReqs.map(obj => ({ ...obj, type: "friend" }));
    const invitesMap = eventInvites.map(obj => ({ ...obj, type: "invite" }));
    setAllNotifications(friendReqsMap.concat(invitesMap));
  }, [friendReqs, eventInvites])

  return ( 
    <div>
        <Dropdown
          floatingArrow= {false}
          arrowIcon={false}
          inline={true}
          label={<div className='hover:text-blue-400'><FontAwesomeIcon icon={solid("bell")} className="px-1" /><span className='pl-1 invisible hidden md:visible md:inline'></span></div>}
          class="bg-transparent hover:text-blue-400"
          dismissOnClick={false}
        >
          {
            allNotifications.length > 0 ? 
          allNotifications.map((notif) => { 
              return (<Dropdown.Item key={notif._id}>
                <div className="flex items-center space-x-4">
                    {notif.type === "friend" ? 
                    <div className="min-w-100 px-8" onClick={() => navigate("/profile/" + notif._id)}>
                        <p className="font-bold text-slate-800 truncate dark:text-white">
                            Friend request
                        </p>
                        <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                            {notif.name}
                        </p>
                        <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                            {notif.email}
                        </p>
                    </div> : 
                    <div className="flex" onClick={() => navigate("/events/" + notif._id)}>
                        <img className="w-9 h-9 mr-2 rounded-full" src={notif.thumbnailId} alt="" />
                        <div className="min-w-100">
                        <p className="font-bold text-slate-800 truncate dark:text-white">
                            Event invitation
                        </p>
                        <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                            {notif.name}
                        </p>
                        <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                            {(new Date(notif.start)).toDateString()}
                        </p>
                        </div>
                    </div> 
                    }
                </div>
              </Dropdown.Item>)
            }
          ): <Dropdown.Item>No notifications!</Dropdown.Item>}
              
        </Dropdown>
    </div>
    );
}