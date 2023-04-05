import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUser } from '../services/api';

function ChatsList(props) {
  const { chats, curUser, changeChat } = props;
  const [chatters, setChatters] = useState([]);
  const [selected, setSelected] = useState(0);

  const navigate = useNavigate();

  const setUsersChats = async () => {
    const getChatters = [];
    for (let j = 0; j < chats.length; j++) {
      const users = chats[j.toString()].users;
      for (let k = 0; k < users.length; k++) {
        if (users[k] !== curUser._id) {
          const response = await getUser(users[k]);
          const user = response.data.data.name; ///// ONLY GRABBING NAMES RN
          getChatters.push(user);
        }
      }
    }
    setChatters(getChatters);
  };

  useEffect(() => {
    //const getChatters = [];
    if (curUser === null) navigate('/login');
    if (chats) {
      setUsersChats();

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

  const changeCurrentChat = (index, chat) => {
    setSelected(index);
    changeChat(chat);
  };

  return (
    <div>
      {chatters.map((name, index) => {
        return (
          <div
            className={`flex ${
              selected === index ? 'bg-blue-500' : 'bg-stone-100'
            }`}
            onClick={() => changeCurrentChat(index, name)}
          >
            <div className="m-3 flex h-10 w-10 items-center justify-center rounded-full bg-blue-400">
              <p>{name[0]}</p>
            </div>
            <div className="grid place-items-center">{name}</div>
          </div>
        );
      })}
    </div>
  );
}

export default ChatsList;
