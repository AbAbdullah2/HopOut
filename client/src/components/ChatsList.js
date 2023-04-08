import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUser } from '../services/api';
import { Combobox } from '@headlessui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { getAllUsers, createChat } from '../services/api.js';

function ChatsList(props) {
  const { chats, curUser, changeChat, getUsersChats } = props;
  const [chatters, setChatters] = useState([]);
  const [selected, setSelected] = useState(undefined);

  const [newChat, setNewChat] = useState('');
  const [query, setQuery] = useState('');
  const [allUsers, setAllUsers] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    getAllUsers().then((res) => {
      setAllUsers(
        res.data.data.filter((u) => {
          return u._id !== curUser._id;
        })
      );
    });
  }, [curUser]);

  const setUsersChats = async () => {
    const getChatters = [];
    for (let j = 0; j < chats.length; j++) {
      const users = chats[j.toString()].users;
      for (let k = 0; k < users.length; k++) {
        if (users[k] !== curUser._id) {
          const response = await getUser(users[k]);
          const user = [response.data.data.name, chats[j.toString()]._id];
          getChatters.push(user);
        }
      }
    }
    setChatters(getChatters);
  };

  useEffect(() => {
    if (curUser === null) navigate('/login');
    if (chats) {
      setUsersChats();
    }
  }, [curUser, chats]);

  const changeCurrentChat = (index, chat) => {
    setSelected(index);
    changeChat(chat);
  };

  const filteredPeople =
    query === ''
      ? allUsers
      : allUsers.filter((person) => {
          return (
            person.name.toLowerCase().includes(query.toLowerCase()) ||
            person.email.toLowerCase().includes(query.toLowerCase())
          );
        });

  const createNewChat = async (msg) => {
    createChat(curUser._id, newChat._id).then(
      (res) => {
        getUsersChats()
      }
    );
  };

  return (
    <div className="border-solid border-r border-slate-800">
      <p>Choose a new chat!</p>
      <div className="mb-4">
        <Combobox
          value={newChat}
          onChange={(e) => {
            setNewChat(e);
          }}
        >
          <div className="relative w-full cursor-default rounded-lg bg-white text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
            <Combobox.Input
              onChange={(event) => setQuery(event.target.value)}
              className="w-full py-2 pl-3 pr-10 rounded border-gray-300 text-sm leading-5 text-gray-900 focus:ring-0"
            />
            <Combobox.Options className="mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {filteredPeople.map((person) => (
                <Combobox.Option
                  key={person._id}
                  value={person}
                  className={({ active }) =>
                    `relative cursor-default select-none py-2 pl-4 pr-4 ${
                      active ? 'bg-blue-600 text-white' : 'text-gray-900'
                    }`
                  }
                >
                  {person.name} <br /> {person.email}
                </Combobox.Option>
              ))}
            </Combobox.Options>
          </div>
        </Combobox>
      </div>
      {newChat ? (
        <button className="bg-blue-500 hover:bg-blue-700 text-white px-4 rounded" onClick={createNewChat}>
          Chat with {newChat.name}
        </button>
      ) : (
        <></>
      )}
      <div className="py-1">
        <hr className="h-px bg-slate-800 border-0"></hr>

        {chatters.map((name, index) => {
          return (
            <div key={index}>
              <div
                className={`flex ${
                  selected === index ? 'bg-blue-500' : 'bg-stone-100'
                }`}
                onClick={() => changeCurrentChat(index, name)}
              >
                <div className="m-3 flex h-10 w-10 items-center justify-center rounded-full bg-blue-400">
                  <p className="uppercase">{name[0][0]}</p>
                </div>
                <div className="grid place-items-center">{name[0]}</div>
              </div>
              <hr className="h-px bg-slate-800 border-0"></hr>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ChatsList;
