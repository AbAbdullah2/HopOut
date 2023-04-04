import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUser } from '../services/api';

function ChatsList(props) {
  const { chats, curUser, changeChat } = props;
  const [chatters, setChatters] = useState([]);

  const navigate = useNavigate();

  const setUsersChats = async () => {
    const getChatters = [];
    for (let j = 0; j < chats.length; j++) {
      const users = chats[j.toString()].users;
      for (let k = 0; k < users.length; k++) {
        if (users[k] !== curUser._id) {
          const response = await getUser(users[k])
          const user = response.data.data.name ///// ONLY GRABBING NAMES RN
          console.log("chatting user", user)
          getChatters.push(user)
        }
      }
    }
    console.log("chatters gotten", getChatters)
    setChatters((getChatters))
    console.log("chatters assigned", chatters)
    //console.log("chatters", chatters)
  }

  useEffect(() => {
    const getChatters = []
    if (curUser === null) navigate('/login');
    if (chats) {
      setUsersChats();
      console.log("current user", curUser)
      
      // const fetchData = async () => {
      //   const data = await getUser();
      // }
      // for (var j = 0; j < chats.length; j++) {
      //   const users = chats[j.toString()].users;
      //   for (let k = 0; k < users.length; k++) {
      //     if (users[k] !== curUser._id) {
      //       getIds.push(users[k])
      //     }
      //   }
      // }
      // console.log("chatters", getIds)
      
      //   for (let i = 0; i < getIds.length; i++) {
      //     let user = async () => {
      //       const user = await getUser(getIds[i])
      //     } 
      //     console.log("user", user)
      // }
      // user();
      // console.log(
      //   'getChatter',
      //   getChatters,
      //   typeof getChatters,
      //   getChatters.length
      // );

      // setChatters(getChatters);
      // console.log(
      //   'chatter',
      //   chatters,
      //   typeof chatters,
      //   chatters.length,
      //   chatters[0]
      // );
    }
  }, [curUser, chats]);

  return (
    <div>
      {chatters.map((name, index) => {
        return <p key={index}>{name}</p>;
      })}
    </div>
  );
}

export default ChatsList;
