/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable no-param-reassign */
/* eslint-disable react/no-array-index-key */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {
  useState, useEffect,
} from 'react';
import { useParams } from 'react-router-dom';
import { useStore } from 'react-redux';
import {
  FiCalendar,
} from 'react-icons/fi';

import moment from 'moment';

import {
  FriendList,
} from '../../components/StyledComponents';

import NavBar from '../../components/NavBar';
import Chat from '../../components/Chat';
import Feed from '../../components/Feed';

import api from '../../services/api';

import defaultProfile from '../../assets/images/defaultProfile.png';
import { PageContainer } from './styles';

const Profile = () => {
  const [chatMessages, setChatMessages] = useState([]);

  const { uniqid } = useParams();
  const store = useStore();

  const { uniqid: userUniqid } = store.getState().user;

  const [accountInfo, setAccountInfo] = useState({});
  const [editProfile, setEditProfile] = useState({});
  const [posts, setPosts] = useState([]);

  const structingPosts = (responsePosts) => {
    const editedPosts = responsePosts.map((post) => {
      const noRepliedComments = post.comments
        .filter((comment) => !comment.is_reply)
        .map((comment) => ({ ...comment, commenting: false, commentBar: '' }))
        .sort((commentA, commentB) => (commentA.created_at < commentB.created_at ? 1 : -1));

      noRepliedComments.forEach((comment) => {
        comment.replies = post.comments
          .filter(
            (repliedComment) => repliedComment.is_reply
            && repliedComment.replyMetadata.comment === comment.uniqid,
          )
          .sort((commentA, commentB) => (commentA.created_at < commentB.created_at ? 1 : -1));

        comment.showReplies = false;
      });

      return {
        ...post, commenting: false, comments: noRepliedComments, commentBar: '',
      };
    });

    return editedPosts.sort((postA, postB) => (postA.created_at < postB.created_at ? 1 : -1));
  };

  useEffect(() => {
    const getProfileInfo = async () => {
      try {
        const response = await api.get(`/u/${uniqid}`);

        const accountData = { ...response.data };

        delete accountData.posts;

        accountData.birthday = moment(accountData.birthday);

        setPosts(structingPosts(response.data.posts));

        setAccountInfo(accountData);

        setEditProfile({
          ...accountData,
          editting: false,
        });
      } catch (err) {
        console.log(err);
      }
    };

    getProfileInfo();
  }, [uniqid]);

  const handleNewSendMessage = (message) => {
    setChatMessages([...chatMessages, { message, type: 1 }]);
  };

  const handleEditProfile = async () => {
    if (editProfile.first_name !== '' && editProfile.last_name !== '' && editProfile.birthday !== '') {
      await api.patch(`/u/${uniqid}`, {
        user: {
          first_name: editProfile.first_name,
          last_name: editProfile.last_name,
          bio: editProfile.bio,
          birthday: editProfile.birthday,
          username: editProfile.username,
        },
      });

      setEditProfile({ ...editProfile, editting: false });
      setAccountInfo({
        ...accountInfo,
        birthday: editProfile.birthday,
        bio: editProfile.bio,
        first_name: editProfile.first_name,
        last_name: editProfile.last_name,
        username: editProfile.username,
      });
    } else {
      setEditProfile({ ...accountInfo, editting: false });
    }
  };

  return (
    <PageContainer>
      <NavBar />
      <FriendList />
      <Chat
        chatMessages={chatMessages}
        handleNewSendMessage={(message) => handleNewSendMessage(message)}
      />
      <aside>
        <img alt="." src={defaultProfile} />
        <div>
          { editProfile.editting ? (
            <div className="nameContainer">
              <input type="text" value={editProfile.first_name} placeholder="First_name" onChange={(e) => setEditProfile({ ...editProfile, first_name: e.target.value })} />
              <input type="text" value={editProfile.last_name} placeholder="Last_name" onChange={(e) => setEditProfile({ ...editProfile, last_name: e.target.value })} />
            </div>
          ) : (
            <strong>
              { `${accountInfo.first_name} ${accountInfo.last_name}` }
            </strong>
          )}

          { editProfile.editting
            ? (
              <div className="username">
                <input type="text" value={editProfile.username} placeholder="Add a username" onChange={(e) => setEditProfile({ ...editProfile, username: e.target.value })} />
              </div>
            ) : (
              <div className="username">
                <p>
                  { editProfile.username ? `@${editProfile.username}` : '' }
                </p>
              </div>
            )}

          {
            !editProfile.editting && accountInfo.uniqid === userUniqid
            && (
            <button type="button" onClick={() => { setEditProfile({ ...editProfile, editting: true }); }}>
              Edit Profie
            </button>
            )
          }

          { editProfile.editting ? <textarea maxLength="150" value={editProfile.bio} placeholder="Add a bio" onChange={(e) => setEditProfile({ ...editProfile, bio: e.target.value })} />
            : (
              <div className="bio">
                <p>
                  { accountInfo.bio }
                </p>
              </div>
            )}

          { editProfile.editting
            ? (
              <div className="birthday">
                <FiCalendar />
                <input type="date" value={editProfile.birthday.format('Y-MM-DD')} placeholder="Birthday" onChange={(e) => setEditProfile({ ...editProfile, birthday: moment(e.target.value.toString()) })} />
              </div>
            ) : (
              <div className="birthday">
                <FiCalendar />
                <p>
                  { editProfile.birthday ? editProfile.birthday.format('DD/MM/Y') : '' }
                </p>
              </div>
            )}

        </div>

        { editProfile.editting && (
        <div className="editBioContainer">
          <div>
            <button
              type="button"
              onClick={() => {
                handleEditProfile();
              }}
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => {
                setEditProfile({
                  first_name: accountInfo.first_name,
                  last_name: accountInfo.last_name,
                  email: accountInfo.email,
                  bio: accountInfo.bio,
                  birthday: accountInfo.birthday,
                  username: accountInfo.username,
                  editting: false,
                });
              }}
            >
              Cancel
            </button>
          </div>
        </div>
        )}

      </aside>
      <main>
        <Feed
          posts={posts}
          setPosts={setPosts}
        />
      </main>
    </PageContainer>
  );
};

export default Profile;
