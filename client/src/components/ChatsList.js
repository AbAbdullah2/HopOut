import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUser } from '../services/api';

function ChatsList(props) {
  const { chats, curUser, changeChat } = props;
  const [chatters, setChatters] = useState([]);

  console.log(chats);
  const navigate = useNavigate();

  useEffect(() => {
    if (curUser === null) navigate('/login');
    for (let chat in chats) {
      console.log('chatters', chat[0]);
      // getUser(chat.users[0]._id).then((res) => {
      //   setChatters(res);
      // });
    }
  }, [curUser, navigate, chats, chatters]);

  return (
    <div>
      {chatters.map((chat, index) => {
        return <p key={index}>{chat}</p>;
      })}
    </div>
  );
}

export default ChatsList;
