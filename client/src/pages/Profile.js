import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro'
import { getUser } from '../services/api';
import Header from '../components/Header';
import NotFound from './NotFound';

export default function Profile(props) {
  const { userid } = useParams();
  const { curUser } = props
  const [user, setUser] = useState(null);
  
  const navigate = useNavigate();

  if (userid === curUser._id) navigate("/account");

  const [friends, setFriends] = useState(false);

  const addFriend = (e) => {
    console.log("adding friend. Curuser: ", curUser);
    console.log("adding friend. userId: ", userid);
    setFriends(true);
  }

  const removeFriend = (e) => {
    console.log("removing friend. curuser and userid: ", curUser, userid);
    setFriends(false);
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
        <Header icons={true} curUser={curUser} />
        <div className='m-5 flex flex-col items-center'>
          <p className='text-4xl font-extrabold text-center'>{user.name}</p>
          <p className='text-lg my-2 text-center'><FontAwesomeIcon icon={solid('envelope')} /> {user.email}</p>
          {friends ? 
          <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full" onClick={removeFriend}> Friend <FontAwesomeIcon icon={solid('circle-check')} /> 
          </button> :
          <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full" onClick={addFriend}>Add friend <FontAwesomeIcon icon={solid('plus')} /> </button>}
        </div>
      </div>
    </div>
  );
}