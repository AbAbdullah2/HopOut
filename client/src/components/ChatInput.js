import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';

function ChatInput(props) {
  const { handleSendMsg } = props;
  const [msg, setMsg] = useState('');
  const sendChat = (event) => {
    event.preventDefault();
    if (msg.length > 0) {
      handleSendMsg(msg);
      setMsg('');
    }
  };

  return (
    <div className=''>
      <form className='flex flex-row m-2' onSubmit={(event) => sendChat(event)}>
        <input
          type="text"
          id="msg"
          className="flex-grow bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-sm mr-3 shadow-md"
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          placeholder="Type your message here"
        />
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow-md"
          type="submit"
        >
          <FontAwesomeIcon icon={solid('paper-plane')} />
        </button>
      </form>
    </div>
  );
}

export default ChatInput;
