import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import ChatsList from '../components/ChatsList';
import ChatBody from '../components/ChatBody';
import { getAllChats, host } from '../services/api';
import io from 'socket.io-client' 

function Chat(props) {
  const { curUser, setCurUser } = props;
  const [chats, setChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(undefined);

  const navigate = useNavigate();
  //const socket = useRef();

  const ENDPOINT = 'http://localhost:6002/';
  const socket = io(ENDPOINT, {
    transports: ['websocket'], upgrade: false
    
  });
  socket.on("connect", () => {
    console.log("connected");
});

socket.on("data", (res) => {
    console.log(res);
});

  // useEffect(() => {
  //   // ... other codes
  //   console.log('c');

  //   // Emitting an event that will trigger in the backend
  //   socket.emit('send-msg', {

  //      msg: " message: msg"
  //     });
  //   console.log('d');

  //   // ... other codes
  // }, []);

  useEffect(() => {

    if (curUser === null) navigate('/login');
    getAllChats(curUser._id).then((res) => {
      let chatters = [];
      for (let i = 0; i < res.data.data.length; i++) {
        chatters.push(res.data.data[i.toString()]);
      }
      setChats(res.data.data);
    });
  }, [curUser]);

  useEffect(() => {
    console.log(chats)
  }, [chats]);

  const handleChatChange = (chat) => {
    setCurrentChat(chat);
  };

  useEffect(() => {
    if (curUser) {
      socket.emit('add-user', curUser._id);
    }
    console.log("emit")
  }, [socket]);

  return (
    <div className="bg-stone-100 min-h-screen">
      <div className="mx-auto flex flex-col h-full">
        <Header icons={true} curUser={curUser} setCurUser={setCurUser} />
        <div className="grid grid-cols-5">
          <ChatsList
            chats={chats}
            curUser={curUser}
            changeChat={handleChatChange}
          ></ChatsList>
          <div className="col-span-4">
            {currentChat === undefined ? (
              <div />
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
