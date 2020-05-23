import React, { useState, useContext } from 'react';
import { useStore } from 'react-redux';
import { useHistory } from 'react-router-dom';

import {
  AiOutlineSearch,
} from 'react-icons/ai';

import {
  FiLogOut,
} from 'react-icons/fi';

import {
  GoGear,
} from 'react-icons/go';

import PersistContext from '../../persistContext';
import { NavBarContainer } from './styles';

import ConfigDialog from '../ConfigDialog';

const NavBar = () => {
  const [searchBar, setSearchBar] = useState('');
  const [openConfig, setOpenConfig] = useState(false);

  const store = useStore();
  const persistor = useContext(PersistContext);
  const history = useHistory();

  const { name, uniqid } = store.getState().user;

  return (
    <>
      <NavBarContainer>
        <ul>
          <li>
            <button type="button" onClick={() => { history.push(`/profile/${uniqid}`); }}>
              <p>{ `${name}` }</p>
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

            <button
              type="button"
              onClick={() => setOpenConfig(true)}
            >
              <GoGear />
            </button>
          </li>
        </ul>
      </NavBarContainer>
      <ConfigDialog
        open={openConfig}
        setOpenConfig={setOpenConfig}
      />
    </>
  );
};


export default NavBar;
