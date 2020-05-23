/* eslint-disable react/no-array-index-key */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from 'react';
import {
  FriendList,
} from '../../components/StyledComponents';

import Chat from '../../components/Chat';
import NavBar from '../../components/NavBar';
import ConfigDialog from '../../components/ConfigDialog';

import defaultProfile from '../../assets/images/defaultProfile.png';
import './styles.css';

const ProfileSearch = () => {
  const [chatMessages, setChatMessages] = useState([]);
  const [openConfig, setOpenConfig] = useState(false);

  const handleNewSendMessage = (message) => {
    setChatMessages([...chatMessages, { message, type: 1 }]);
  };

  return (
    <div className="Container">
      <NavBar
        setOpenConfig={setOpenConfig}
      />
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
      <ConfigDialog
        open={openConfig}
        setOpenConfig={setOpenConfig}
      />
    </div>
  );
};

export default ProfileSearch;
