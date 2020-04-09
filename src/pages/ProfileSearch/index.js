/* eslint-disable react/no-array-index-key */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { useStore } from 'react-redux';
import {
  FiLogOut,
} from 'react-icons/fi';

import {
  AiOutlineSearch,
} from 'react-icons/ai';

import {
  NavBar, FriendList,
} from '../../components/StyledCompenents';

import Chat from '../../components/Chat';

import PersistContext from '../../persistContext';

import defaultProfile from '../../assets/images/defaultProfile.png';
import './styles.css';

const ProfileSearch = () => {
  const [chatMessages, setChatMessages] = useState([]);
  const store = useStore();
  const persistor = useContext(PersistContext);
  const history = useHistory();
  const [searchBar, setSearchBar] = useState('');

  const { name: userName } = store.getState().user;

  const handleNewSendMessage = (message) => {
    setChatMessages([...chatMessages, { message, type: 1 }]);
  };

  return (
    <div className="Container">
      <NavBar>
        <ul>
          <li>
            <p>{ `${userName}` }</p>
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
      <FriendList />
      <Chat
        chatMessages={chatMessages}
        handleNewSendMessage={(message) => handleNewSendMessage(message)}
      />
      <main>
        <div className="profiles">
          <div className="profile">
            <div className="photo">
              <img src={defaultProfile} alt="." />
            </div>
            <div className="info">
              <strong className="name"> npm, Inc. </strong>
              <p className="bio">
                i am the package manager for javascript. problems?
                try @npm_support, @npmstatus, and npm.community
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfileSearch;
