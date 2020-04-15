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

const ConfigDialog = ({ forwardRef }) => {
  const changeModalDisplay = () => {
    if (forwardRef.current.style.display === 'block' && forwardRef.current.style.display) {
      forwardRef.current.style.display = 'none';
    } else {
      forwardRef.current.style.display = 'block';
    }
  };

  const [editProfile, setEditProfile] = useState({
    email: {
      value: 'danielp.arruda@gmail.com',
      editting: false,
    },
    password: {
      value: '',
      editting: false,
    },
  });

  return (
    <Container ref={forwardRef}>
      <div className="configContent">
        <FiX onClick={() => { changeModalDisplay(); }} />
        { editProfile.email.editting
          ? (
            <div className="gridEdit gridEditting">
              <strong> E-mail </strong>
              <input type="email" placeholder="Type your new email" />
              <div className="editButtons">
                <div>
                  <button
                    type="button"
                    onClick={() => {
                      setEditProfile({
                        ...editProfile,
                        email: {
                          value: editProfile.email.value,
                          editting: !editProfile.email.editting,
                        },
                      });
                    }}
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditProfile({
                        ...editProfile,
                        email: {
                          value: editProfile.email.value,
                          editting: !editProfile.email.editting,
                        },
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
              <p>
                {editProfile.email.value}
              </p>
              <button
                type="button"
                className="toEditButton"
                onClick={() => {
                  setEditProfile({
                    ...editProfile,
                    email: {
                      value: editProfile.email.value,
                      editting: !editProfile.email.editting,
                    },
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

        { editProfile.password.editting
          ? (
            <div className="editting">
              <strong> Password </strong>
              <div>
                <div>
                  <strong> New Password </strong>
                  <input type="password" placeholder="Type your new password" />
                </div>

                <div>
                  <strong> Confirm Password </strong>
                  <input type="password" placeholder="Confirm your password" />
                </div>
                <div className="editButtons">
                  <div>
                    <button
                      type="button"
                      onClick={() => {
                        setEditProfile({
                          ...editProfile,
                          password: {
                            value: editProfile.password.value,
                            editting: !editProfile.password.editting,
                          },
                        });
                      }}
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditProfile({
                          ...editProfile,
                          password: {
                            value: editProfile.password.value,
                            editting: !editProfile.password.editting,
                          },
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
                      password: {
                        value: editProfile.password.value,
                        editting: !editProfile.password.editting,
                      },
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
