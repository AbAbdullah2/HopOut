import React, { useState, useEffect, useRef } from 'react';
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

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };  

  useEffect(() => {
    scrollToBottom();
  }, [messages]);  

  return (
    <div className="bg-stone-100 flex flex-col h-full">
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-center shadow-md">
          <div className="m-3 flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 font-extrabold">
            <p className='uppercase text-white'>{curChat[0][0]}</p>
          </div>
          <p className='font-semibold'>{curChat[0]}</p>
        </div>
        <div className="overflow-auto p-5 flex-grow">
          <div className="flex-col">
            {messages.map((message, index) => {
              return (
                <div key={index}>
                  <div>
                    {message['receiver'] === curUser._id ? (
                      <div className="py-1 flex justify-start">
                        <div className="flex align-items-center bg-slate-400 justify-start px-5 py-1 max-w-fit max-w-md break-words	rounded-2xl">
                          {message['message']}
                        </div>
                      </div>
                    ) : (
                      <div className="py-1 flex justify-end">
                        <div className="flex align-items-center bg-blue-900 justify-end px-5 py-1 max-w-fit max-w-md break-words rounded-2xl text-white">
                          {message['message']}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        </div>
        <ChatInput handleSendMsg={handleSendMsg}></ChatInput>
      </div>
    </div>
  );
}

export default ChatBody;
