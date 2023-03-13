import { Dropdown } from 'flowbite-react'
import { useState, useEffect } from 'react';
import { getAllUsers, getAllEvents } from '../services/api'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { useNavigate } from 'react-router-dom'

export default function Notifications(props) {
  const {curUser} = props;
  // remove this when user actually has recievedFriends
  curUser.recievedFriends = [
      "6403b70b76c36710b19caa6a",
      "6403e981caf7459f5b6269b2"
  ];
  curUser.invited = [
      "64065ac0a4aac4b29a59ba54", 
      "64065a69c43001138f1298ef"
  ];
  const navigate = useNavigate();
  const [allNotifications, setAllNotifications] = useState([]);

  const [friendReqsIds, setFriendReqsIds] = useState(curUser.recievedFriends);
  const [friendReqs, setFriendReqs] = useState([]);
  const [eventInvites, setEventInvites] = useState([]);

  useEffect(() => {
    // get all users and filter by IDs found in friendReqs
    getAllUsers().then(userData => {
        let users = userData.data.data;
        users = [{
            _id: "6403b70b76c36710b19caa6a",
            name: "John D'Cruz",
            email: "fefejk@jhu.edu"
        },
        {
            _id: "6403e981caf7459f5b6269b2",
            name: "Abc",
            email: "efjkenfe@jhu.edu"

        },
        ];
        setFriendReqs(users.filter(function (user) {
            return (friendReqsIds.includes(user._id));
        }));
    });

    getAllEvents().then(eventData => {
        let events = eventData.data.data;
        events = [{
            _id: "64065ac0a4aac4b29a59ba54",
            name: "Hop out party",
            start: "03/02/2023",
            thumbnailId: "https://picsum.photos/1000/1000"
        },
        {
            _id: "64065a69c43001138f1298ef",
            name: "Hop out party 2",
            start: "05/20/2023",
            thumbnailId: "https://picsum.photos/1000/1000"
        },
        ];
        setEventInvites(events.filter(function (event) {
            return (curUser.invited.includes(event._id));
        }));
    });

  }, []);

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
          {allNotifications.map((notif) =>{ 
              return (<Dropdown.Item>
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
                        <img className="w-9 h-9 mr-2 rounded-full" src={notif.thumbnailId} alt="Event image" />
                        <div className="min-w-100">
                        <p className="font-bold text-slate-800 truncate dark:text-white">
                            Event invitation
                        </p>
                        <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                            {notif.name}
                        </p>
                        <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                            {notif.start}
                        </p>
                        </div>
                    </div> 
                    }
                </div>
              </Dropdown.Item>)
            }
          )}
              
        </Dropdown>
    </div>
    );
}