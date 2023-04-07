import React, { useState } from 'react';

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
    <div>
      <form onSubmit={(event) => sendChat(event)}>
        <input
          type="text"
          id="msg"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-sm w-5/6"
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          placeholder="Type your message here"
        />
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          type="submit"
        >
          Button
        </button>
      </form>
    </div>
  );
}

export default ChatInput;
