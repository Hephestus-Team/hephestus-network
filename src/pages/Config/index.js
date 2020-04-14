import React, { useState, useEffect, useContext } from 'react';
import { useStore } from 'react-redux';
import { useHistory } from 'react-router-dom';

import moment from 'moment';

import {
  FiLogOut,
} from 'react-icons/fi';

import {
  AiOutlineSearch,
} from 'react-icons/ai';

import {
  MdModeEdit,
} from 'react-icons/md';

import PersistContext from '../../persistContext';
import api from '../../services/api';

import './styles.css';

import Chat from '../../components/Chat';

import {
  NavBar, FriendList,
} from '../../components/StyledComponents';

const Config = () => {
  const [chatMessages, setChatMessages] = useState([]);
  const [searchBar, setSearchBar] = useState('');
  const [editProfile, seteditProfile] = useState({
    email: {
      value: '',
      editting: false,
    },
    senha: {
      value: '',
      editting: false,
    },
  });

  const persistor = useContext(PersistContext);

  const store = useStore();
  const history = useHistory();

  const { name, uniqid } = store.getState().user;

  useEffect(() => {
    const getProfileInfo = async () => {
      try {
        const response = await api.get(`/u/${uniqid}`, {
          headers: {
            Authorization: store.getState().user.token,
            u: uniqid,
          },
        });

        console.log(response.data);
      } catch (err) {
        console.log(err);
      }
    };

    getProfileInfo();
  }, [uniqid, store]);

  const handleNewSendMessage = (message) => {
    setChatMessages([...chatMessages, { message, type: 1 }]);
  };

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
      <main className="configContainer">
        <div>
          <strong> Nome </strong>
          <p> Daniel Arruda </p>
          <button type="button" className="toEditButton">
            <MdModeEdit />
            <a href="#">
              Editar
            </a>
          </button>
        </div>

        <div>
          <strong> Nome </strong>
          <input type="text" name="" placeholder="Type your new name" />
          <div className="editButtons">
            <div>
              <button
                type="button"
              >
                Save
              </button>
              <button
                type="button"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Config;
