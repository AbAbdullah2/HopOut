import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro'
import { getUser, sendFriendReq, acceptFriendReq, declineFriendReq, removeFriend, removeFriendReq} from '../services/api';
import Header from '../components/Header';
import RemoveFriendConfirm from '../components/RemoveFriendConfirm';


export default function Profile(props) {
  const { userid } = useParams();
  const { curUser, setCurUser} = props
  const [user, setUser] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  
  const navigate = useNavigate();

  if (userid === curUser._id) navigate("/account");

  const [friendStatus, setFriendStatus] = useState("none");  

  const renderSwitch = () => {
    switch(friendStatus) {
      case "friends":
        return (<button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full" 
          onClick={() => setShowConfirm(true)}> Friend <FontAwesomeIcon icon={solid('circle-check')} /> 
        </button>)
      case "sent":
        return (<button className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-full" onClick={handleUnsendReq}> Friend request sent <FontAwesomeIcon icon={solid('circle-check')} /> 
        </button> )
      case "received":
        return (
          <div className="items-center py-5 px-12 lg:px-4" role="alert">
          <div className="bg-blue-500 shadow-md px-7 py-3 rounded-md items-center text-blue-100 leading-none lg:rounded-full flex lg:inline-flex " >
            <span className="font-semibold text-left flex-auto">{user.name} sent you a friend request.  </span>
            <button className="hover:bg-blue-400 font-bold ml-2 py-2 px-2 rounded-md" onClick={handleAcceptFriend}>Accept <FontAwesomeIcon icon={solid('check')} /></button>
            <button className="hover:bg-blue-400 font-bold py-2 px-2 rounded-md" onClick={handleDenyFriend}>Deny <FontAwesomeIcon icon={solid('x')} /></button>
          </div>
        </div>
        )
        
      default:
        return (<button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full" onClick={handleSendReq}>Add friend <FontAwesomeIcon icon={solid('plus')} /> </button>)
    }
  }

  const handleSendReq = (e) => {
    setFriendStatus("sent");  
    sendFriendReq(curUser._id, user._id).then((sendRes) => {
      setCurUser(sendRes.data.data);
    });
  }

  const handleAcceptFriend = (e) => {
    setFriendStatus("friends")        
    acceptFriendReq(curUser._id, user._id).then((acceptRes) => {
      setCurUser(acceptRes.data.data);
    });
  }

  const handleDenyFriend = (e) => {
    setFriendStatus("none");
    declineFriendReq(curUser._id, user._id).then((declineRes) => {
      setCurUser(declineRes.data.data);
    });
  }

  const handleUnsendReq = (e) => {
    setFriendStatus("none");
    removeFriendReq(curUser._id, user._id).then((removeReqRes) => {
      setCurUser(removeReqRes.data.data);
    });
  }

  const closeModal = () => {
    setFriendStatus(false);
    setShowConfirm(false);
  }

  useEffect(() => {
    if (curUser === null) navigate('/login');
    getUser(userid).then((res) => {
      setUser(res.data.data);
    });

    getUser(curUser._id).then((res) => {
      setCurUser(res.data.data);
      res.data.data.sentFriends.forEach(e => {
        if (e.user === userid) {
          setFriendStatus("sent");
        }
      });
      res.data.data.receivedFriends.forEach(e => {
        if (e.user === userid) {
          setFriendStatus("received");
        }
      });
      res.data.data.friends.forEach(e => {
        if (e.user === userid) {
          setFriendStatus("friends");
        }
      });
    });

  }, [userid, navigate]);

  return user === null ? <></> : (
    <div className='bg-stone-100 min-h-screen'>
      <RemoveFriendConfirm curUser={curUser} setCurUser={setCurUser} showConfirm={showConfirm} closeModal={closeModal} unfriended={user}/> 
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