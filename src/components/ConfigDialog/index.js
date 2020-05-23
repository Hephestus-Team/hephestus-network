/* eslint-disable no-param-reassign */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from 'react';

import {
  MdModeEdit,
} from 'react-icons/md';

import {
  FiX,
} from 'react-icons/fi';

import { Container } from './styles';

import Input from '../Input';

const ConfigDialog = ({ open, setOpenConfig }) => {
  const [editProfile, setEditProfile] = useState({
    email: false,
    password: false,
  });

  const [newPassword, setNewPassword] = useState('');
  const [confPassword, setConfPassword] = useState({
    value: '',
    error: '',
  });
  const [email, setEmail] = useState('');

  const handlePasswordSave = () => {
    if (newPassword !== confPassword.value) {
      setConfPassword({
        ...confPassword,
        error: 'Passwords does not match',
      });
    } else {
      console.log(newPassword);
      setNewPassword('');
      setConfPassword({
        value: '',
        error: '',
      });
      setEditProfile({
        ...editProfile,
        password: !editProfile.password,
      });
    }
  };

  return (
    <Container open={open}>
      <div className="configContent">
        <FiX onClick={() => { setOpenConfig(false); }} />
        { editProfile.email
          ? (
            <div className="gridEdit gridEditting">
              <strong> E-mail </strong>
              <input
                type="email"
                placeholder="Type your new email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <div className="editButtons">
                <div>
                  <button
                    type="button"
                    onClick={() => {
                      setEmail('');
                      setEditProfile({
                        ...editProfile,
                        email: !editProfile.email,
                      });
                    }}
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEmail('');
                      setEditProfile({
                        ...editProfile,
                        email: !editProfile.email,
                      });
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )
          : (
            <div className="gridEdit">
              <strong> E-mail </strong>
              <p />
              <button
                type="button"
                className="toEditButton"
                onClick={() => {
                  setEditProfile({
                    ...editProfile,
                    email: !editProfile.email,
                  });
                }}
              >
                <MdModeEdit />
                <p>
                  Editar
                </p>
              </button>
            </div>
          )}

        { editProfile.password
          ? (
            <div className="editting">
              <strong> Password </strong>
              <div>
                <div>
                  <Input
                    type="password"
                    placeholder="Type your new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    labelText="New Password"
                  />
                </div>

                <div>
                  <Input
                    type="password"
                    placeholder="Confirm your password"
                    value={confPassword.value}
                    onChange={(e) => setConfPassword({
                      ...confPassword,
                      value: e.target.value,
                    })}
                    error={confPassword.error}
                    labelText="Confirm Password"
                  />
                </div>

                <div className="editButtons">
                  <div>
                    <button
                      type="button"
                      onClick={() => {
                        handlePasswordSave();
                      }}
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setNewPassword('');
                        setConfPassword({
                          value: '',
                          error: '',
                        });
                        setEditProfile({
                          ...editProfile,
                          password: !editProfile.password,
                        });
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )
          : (
            <>
              <div className="gridEdit">
                <strong> Password </strong>
                <p />
                <button
                  type="button"
                  className="toEditButton"
                  onClick={() => {
                    setEditProfile({
                      ...editProfile,
                      password: !editProfile.password,
                    });
                  }}
                >
                  <MdModeEdit />
                  <p>
                    Editar
                  </p>
                </button>
              </div>
            </>
          )}
      </div>
    </Container>
  );
};

export default ConfigDialog;
