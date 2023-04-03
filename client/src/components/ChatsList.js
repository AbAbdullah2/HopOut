import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUser } from '../services/api';

function ChatsList(props) {
  const { chats, curUser, changeChat } = props;
  const [chatters, setChatters] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    if (curUser === null) navigate('/login');
    if (chats) {
      const getChatters = [];
      for (var j = 0; j < chats.length; j++) {
        getUser(chats[j].users[0]).then((res) => {
          const name = res.data.data.name;
          getChatters.push(name);
        });
      }
      console.log(
        'getChatter',
        getChatters,
        typeof getChatters,
        getChatters.length
      );

      setChatters(getChatters);
      console.log(
        'chatter',
        chatters,
        typeof chatters,
        chatters.length,
        chatters[0]
      );
    }
  }, [curUser, chats]);

  return (
    <div>
      {chatters.map((contact, index) => {
        return <p key={index}>{contact}</p>;
      })}
      <p>fjewksd</p>
    </div>
  );
}

export default ChatsList;
