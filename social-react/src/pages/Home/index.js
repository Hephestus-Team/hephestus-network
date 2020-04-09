import React, { useState, useContext } from 'react';
import { useStore } from 'react-redux';
import { useHistory } from 'react-router-dom';

import {
  FiSearch, FiLogOut,
} from 'react-icons/fi';

import PersistContext from '../../persistContext';

import Chat from '../../components/Chat';

import {
  NavBar, FriendList,
} from '../../components/StyledCompenents';

const Home = () => {
  const [chatMessages, setChatMessages] = useState([]);

  const handleNewSendMessage = (message) => {
    setChatMessages([...chatMessages, { message, type: 1 }]);
  };

  const persistor = useContext(PersistContext);

  const store = useStore();
  const history = useHistory();

  const { name, uniqid } = store.getState().user;

  return (
    <>
      <NavBar>
        <ul>
          <li>
            <button type="button" onClick={() => { history.push(`/profile/${uniqid}`); }}>
              <p>{`${name}`}</p>
            </button>
          </li>
          <li>
            <p>Search</p>
            <div>
              <input type="text" />
              <FiSearch />
            </div>
          </li>
          <li>
            <button
              type="button"
              onClick={() => {
                persistor.purge();
                window.location.reload(false);
              }}
            >
              <FiLogOut />
              Logout
            </button>
          </li>
        </ul>
      </NavBar>
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
