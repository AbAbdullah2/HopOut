import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getChat } from '../services/api';

function ChatBody(props) {
  const { curChat, curUser } = props;
  const [messages, setMessages] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    if (curUser === null) navigate('/login');

    const currentChat = async () => {
      if (curChat) {
        getChat(curChat[1].toString()).then((res) => {
          console.log(res.data.data);
        });
      }
    };
    currentChat().catch(console.error);
  }, [curUser, curChat]);

  return <div className="bg-blue-900">hello</div>;
}

export default ChatBody;
