import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro'
import { getUser, addFriend, deleteFriend } from '../services/api';
import Header from '../components/Header';


export default function Profile(props) {
  const { userid } = useParams();
  const { curUser, setCurUser} = props
  const [user, setUser] = useState(null);
  
  const navigate = useNavigate();

  if (userid === curUser._id) navigate("/account");

  const [friends, setFriends] = useState(false);

  const [friendStatus, setFriendStatus] = useState("none");

  const renderSwitch = () => {
    switch(friendStatus) {
      case "friends":
        return (<button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full" 
          onClick={handleUnfriend}> Friend <FontAwesomeIcon icon={solid('circle-check')} /> 
        </button>)
      case "sent":
        return (<button className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-full" onClick={handleUnsendReq}> Friend request sent <FontAwesomeIcon icon={solid('circle-check')} /> 
        </button> )
      case "recieved":
        return (
          <div className="items-center py-5 px-12 lg:px-4" role="alert">
          <div className="bg-blue-900 shadow-md px-7 py-3 rounded-md items-center text-blue-100 leading-none lg:rounded-full flex lg:inline-flex " >
            <span className="font-semibold text-left flex-auto">{user.name} sent you a friend request. </span>
            <button className="hover:bg-blue-400 font-bold py-2 px-3 rounded-full" onClick={handleAcceptFriend}>Accept <FontAwesomeIcon icon={solid('check')} /></button>
            <button className="hover:bg-blue-400 font-bold py-2 px-3 rounded-full" onClick={handleDenyFriend}>Deny <FontAwesomeIcon icon={solid('x')} /></button>
          </div>
        </div>
        )
        
      default:
        return (<button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full" onClick={handleSendReq}>Add friend <FontAwesomeIcon icon={solid('plus')} /> </button>)
    }
  }

  const handleSendReq = (e) => {
    addFriend(curUser, user);
    setFriendStatus("sent")
    // setFriends(true);
  }

  const handleAcceptFriend = (e) => {
    // addFriend(curUser, user);
    // setFriends(true);
    setFriendStatus("friends");
  }
  const handleDenyFriend = (e) => {
    // delete friend request from both users in DB 
    setFriendStatus("none");
  }

  const handleUnsendReq = (e) => {
    // delete friend request from both users in DB 
    setFriendStatus("none");
    // setFriends(true);
  }

  const handleUnfriend = (e) => {
    deleteFriend(curUser, user);
    setFriends(false);
    setFriendStatus("none");
  }

  useEffect(() => {
    if (curUser === null) navigate('/login');
    getUser(userid).then((res) => {
      setUser(res.data.data);
      // setting friends state
      // setFriends(curUser._id in res.data.data.friends);
    });  
  }, []);

  useEffect(() => {
    // Update friendslist through api call 
  }, [friends]);

  return user === null ? <></> : (
    <div className='bg-stone-100 min-h-screen'>
      <div className='mx-auto flex flex-col h-full'>
        <Header icons={true} curUser={curUser} setCurUser={setCurUser}/>
        <div className='m-5 flex flex-col items-center'>
          <p className='text-4xl font-extrabold text-center'>{user.name}</p>
          <p className='text-lg my-2 text-center'><FontAwesomeIcon icon={solid('envelope')} /> {user.email}</p>
          {renderSwitch()}
        </div>
      </div>
    </div>
  );
}