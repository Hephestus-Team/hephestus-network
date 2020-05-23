import React, { useState } from 'react';

import Chat from '../../components/Chat';

import {
  FriendList,
} from '../../components/StyledComponents';

import NavBar from '../../components/NavBar';

const Home = () => {
  const [chatMessages, setChatMessages] = useState([]);

  const handleNewSendMessage = (message) => {
    setChatMessages([...chatMessages, { message, type: 1 }]);
  };

  return (
    <>
      <NavBar />
      <FriendList>
        <ul />
      </FriendList>
      <Chat
        chatMessages={chatMessages}
        handleNewSendMessage={(message) => handleNewSendMessage(message)}
      />
    </>
  );
};

export default Home;
