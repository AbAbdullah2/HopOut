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
    console.log("curUser", curUser)
    getAllChats(curUser._id).then((res) => {
      let chatters = [];
      for (let i = 0; i < (res.data.data.length); i++) {
        chatters.push(res.data.data[i.toString()])
      }

      // console.log("res", res.data.data)
      // console.log("chat", chatters)
      setChats(res.data.data);
      // console.log("chats", chats)
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
