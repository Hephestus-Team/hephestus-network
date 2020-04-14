import React, { useState, useContext } from 'react';
import { useStore } from 'react-redux';
import { useHistory } from 'react-router-dom';

import {
  FiLogOut,
} from 'react-icons/fi';

import {
  AiOutlineSearch,
} from 'react-icons/ai';

import PersistContext from '../../persistContext';

import Chat from '../../components/Chat';

import {
  NavBar, FriendList,
} from '../../components/StyledComponents';

const Home = () => {
  const [chatMessages, setChatMessages] = useState([]);
  const [searchBar, setSearchBar] = useState('');

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
            <div>
              <input type="text" placeholder="Search" value={searchBar} onChange={(e) => setSearchBar(e.target.value)} />
              <button type="button">
                <AiOutlineSearch />
              </button>
            </div>
          </li>
          <li>
            <button
              type="button"
              onClick={() => {
                persistor.purge();
                history.push('/');
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
