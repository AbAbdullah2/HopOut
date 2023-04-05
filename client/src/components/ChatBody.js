import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getChat } from '../services/api';

function ChatBody(props) {
  const { curChat, curUser } = props;
  const [messages, setMessages] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (curUser === null) navigate('/login');
    console.log("cur chat", curChat)
    
    const currentChat = async () => {
      if (curChat) {
        const getMessages = []
        await getChat(curChat[1].toString()).then((res) => {
          for (let i = 0; i < res.data.data.messages.length; i++) {
            const message = (res.data.data.messages[i.toString()].message, res.data.data.messages[i.toString()]); // NEED EMI AND JOHN TO HELP FIGURE OUT HOW TO MAP OBJECTS
            getMessages.push(message)
          }
          
          // console.log("cur chat messages", res.data.data.messages);
        });
        setMessages(getMessages)
      }
      
    };
    
    currentChat().catch(console.error);
  }, [curUser, curChat]);

  useEffect(() => {
    // const messageVal = Object.values(messages)
    // console.log("values", messageVal)
    console.log("after setting", messages)
    console.log("length", messages.length)
    for (let i = 0; i < messages.length; i++) {
       console.log("message", messages[i.toString()])
    }
    // console.log('finished')
  }, [messages])

  return <div className="bg-blue-900">
    {messages.map((message, index) => {
        return (
          <div key={index}>
            <div
              // className={`flex ${
              //   selected === index ? 'bg-blue-500' : 'bg-stone-100'
              // }`}
              //onClick={() => changeCurrentChat(index, name)}
            >
              <div className="m-3 flex h-10 w-10 items-center justify-center rounded-full bg-blue-400">
                <p>{curChat[0][0]}</p>
              </div>
              <div className="grid place-items-center">{message['message']}</div>
            </div>
          </div>
        );
      })}
  </div>;
}

export default ChatBody;
