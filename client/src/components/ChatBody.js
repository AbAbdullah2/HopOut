import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getChat, sendMessage } from '../services/api';
import ChatInput from './ChatInput';

function ChatBody(props) {
  const { curChat, curUser, socket } = props;
  const [messages, setMessages] = useState([]);
  const [receiver, setReceiver] = useState([]);
  const [arrivalMessage, setArrivalMessage] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (curUser === null) navigate('/login');

    currentChat().catch(console.error);
  }, [curUser, curChat]);

  const currentChat = async () => {
    if (curChat) {
      const getMessages = [];
      await getChat(curChat[1].toString()).then((res) => {
        if (res.data.data.users[0] === curUser._id) {
          setReceiver(res.data.data.users[1]);
        } else if (res.data.data.users[1] === curUser._id) {
          setReceiver(res.data.data.users[0]);
        }
        for (let i = 0; i < res.data.data.messages.length; i++) {
          const message =
            (res.data.data.messages[i.toString()].message,
            res.data.data.messages[i.toString()]);
          getMessages.push(message);
        }
      });
      setMessages(getMessages);
    }
  };

  const handleSendMsg = async (msg) => {
    sendMessage(curChat[1].toString(), curUser._id, receiver, msg).then(
      (res) => {
        currentChat().catch(console.error);
      }
    );
    socket.emit('send-msg', {
      to: receiver,
      from: curUser._id,
      message: msg,
    });
    const msgs = [...messages];
    msgs.push({ message: msg, receiver });
    setMessages(msgs);
  };

  useEffect(() => {
    //if (socket.current) {
    socket.on('msg-recieved', (msg) => {
      setArrivalMessage({ message: msg, receiver: curUser._id });
    });
    //}
  }, [socket]);

  useEffect(() => {
    arrivalMessage && setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage]);

  // useEffect(() => {
  //   console.log(messages);
  // }, [messages]);

  return (
    <div className="h-screen bg-stone-100">
      <div className=" flex items-center justify-center">
        <div className="m-3 flex h-10 w-10 items-center justify-center rounded-full bg-blue-400">
          <p>{curChat[0][0]}</p>
        </div>
        <div>
          <p>{curChat[0]}</p>
        </div>
      </div>
      <hr className="h-px bg-slate-800 border-0"></hr>

      {messages.map((message, index) => {
        return (
          <div key={index}>
            <div>
              {message['receiver'] === curUser._id ? (
                <div className="grid place-items-center bg-blue-400">
                  {message['message']}
                </div>
              ) : (
                <div className="grid place-items-center bg-blue-900">
                  {message['message']}
                </div>
              )}
            </div>
          </div>
        );
      })}
      <ChatInput handleSendMsg={handleSendMsg}></ChatInput>
    </div>
  );
}

export default ChatBody;
