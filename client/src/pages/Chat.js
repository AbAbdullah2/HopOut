import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import ChatsList from '../components/ChatsList';
import ChatBody from '../components/ChatBody';
import { getAllChats } from '../services/api';
import io from 'socket.io-client' 

function Chat(props) {
  const { curUser, setCurUser } = props;
  const [chats, setChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(undefined);

  const navigate = useNavigate();
  //const socket = useRef();

  const ENDPOINT =
  !process.env.NODE_ENV || process.env.NODE_ENV === 'development'
    ? 'http://localhost:6002'
    : 'https://hop-out-api-5ced6a082730.herokuapp.com';

  const socket = io(ENDPOINT, {
    transports: ['websocket'], upgrade: false
  });

  const getUsersChats = useCallback(async () => {
    getAllChats(curUser._id).then((res) => {
      let chatters = [];
      for (let i = 0; i < res.data.data.length; i++) {
        chatters.push(res.data.data[i.toString()]);
      }
      setChats(res.data.data);
    });
  }, [curUser._id]);

  useEffect(() => {
    if (curUser === null) navigate('/login');
      getUsersChats()
  }, [curUser, getUsersChats, navigate]);


  const handleChatChange = (chat) => {
    setCurrentChat(chat);
  };

  useEffect(() => {
    if (curUser) {
      socket.emit('add-user', curUser._id);
    }
  }, [curUser, socket]);

  return (
    <div className="bg-stone-100">
      <div className="mx-auto flex flex-col">
        <Header icons={true} curUser={curUser} setCurUser={setCurUser} />
        <div className="grid grid-cols-5 h-screen-minus-header">
          <ChatsList
            chats={chats}
            curUser={curUser}
            changeChat={handleChatChange}
            getUsersChats={getUsersChats}
          ></ChatsList>
          <div className="col-span-4 overflow-y-auto">
            {currentChat === undefined ? (
              <div className='flex h-full text-center items-center justify-center'>
                <p className='text-4xl'>No chat selected</p>
              </div>
            ) : (
              <ChatBody
                curChat={currentChat}
                curUser={curUser}
                key={currentChat}
                socket={socket}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chat;
