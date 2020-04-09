/* eslint-disable react/no-array-index-key */
/* eslint-disable no-param-reassign */
import React, { useRef } from 'react';
import { FiX } from 'react-icons/fi';

import { ChatStyle, MessageBallon } from './styles';

const Chat = ({ chatMessages, handleNewSendMessage }) => {
  const chat = useRef(null);

  const changeChatExpansion = () => {
    const elements = Array.from(chat.current.children).filter(
      (element) => element.nodeName !== 'BUTTON',
    );

    if (chat.current.style.height === '50vh') {
      chat.current.style.height = '7vh';
      elements.forEach((element) => { element.style.display = 'none'; });
    } else {
      chat.current.style.height = '50vh';
      elements.forEach((element) => { element.style.display = 'initial'; });
    }
  };

  return (
    <ChatStyle ref={chat}>
      <button type="button" onClick={changeChatExpansion}>
        <strong>Pedro Muniz</strong>
        <FiX />
      </button>
      <section>
        {chatMessages.map((messageInfo, index) => (messageInfo.type === 1 ? (
          <MessageBallon className="userMsg" key={index}>
            <p>{messageInfo.message}</p>
          </MessageBallon>
        ) : (
          <MessageBallon className="friendMsg" key={index}>
            <p>{messageInfo.message}</p>
          </MessageBallon>
        )))}
      </section>
      <input
        type="text"
        placeholder="Type a Message"
        onKeyPress={(e) => {
          if (e.which === 13) handleNewSendMessage(e.target.value);
        }}
      />
    </ChatStyle>
  );
};

export default Chat;
