import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import ChatsList from '../components/ChatsList';
import ChatBody from '../components/ChatBody';
import { getAllChats } from '../services/api';

function Chat(props) {
  const { curUser, setCurUser } = props;
  const [chats, setChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(undefined);

  const navigate = useNavigate();

  useEffect(() => {
    if (curUser === null) navigate('/login');
    getAllChats(curUser._id).then((res) => {
      setChats(res.data.data);
    });
  }, [curUser]);

  const handleChatChange = (chat) => {
    setCurrentChat(chat);
  };

  return (
    <div className="bg-stone-100 min-h-screen">
      <div className="mx-auto flex flex-col h-full">
        <Header icons={true} curUser={curUser} setCurUser={setCurUser} />
        {
          <ChatsList
            chats={chats}
            curUser={curUser}
            changeChat={handleChatChange}
          ></ChatsList>
        }
        {<ChatBody currentChat={currentChat} currentUser={curUser}></ChatBody>}
      </div>
    </div>
  );
}

export default Chat;
