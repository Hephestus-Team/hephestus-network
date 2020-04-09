/* eslint-disable no-param-reassign */
/* eslint-disable react/no-array-index-key */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect, useContext } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useStore } from 'react-redux';
import {
  FiLogOut, FiMail, FiCalendar,
} from 'react-icons/fi';

import {
  AiOutlineSearch,
} from 'react-icons/ai';

import {
  NavBar, FriendList,
} from '../../components/StyledCompenents';

import Chat from '../../components/Chat';
import Post from '../../components/Post';

import api from '../../services/api';

import PersistContext from '../../persistContext';

import defaultProfile from '../../assets/images/defaultProfile.png';
import { PageContainer } from './styles';

const Profile = () => {
  const [chatMessages, setChatMessages] = useState([]);
  const [searchBar, setSearchBar] = useState('');
  const { uniqid } = useParams();
  const store = useStore();
  const persistor = useContext(PersistContext);
  const history = useHistory();

  const [accountInfo, setAccountInfo] = useState({});
  const [posts, setPosts] = useState([]);

  const { name, uniqid: userUniqid } = store.getState().user;

  useEffect(() => {
    const getProfileInfo = async () => {
      try {
        const response = await api.get(`/u/${uniqid}`, {
          headers: {
            Authorization: store.getState().user.token,
            u: store.getState().user.uniqid,
          },
        });

        const accountData = { ...response.data };

        delete accountData.posts;

        setAccountInfo(accountData);

        const editedPosts = response.data.posts.map((post) => {
          const noRepliedComments = post.comments.filter((comment) => !comment.is_reply).map((comment) => ({ ...comment, commenting: false, commentBar: '' }));

          noRepliedComments.forEach((comment) => {
            comment.replies = post.comments.filter(
              (repliedComment) => repliedComment.is_reply
            && repliedComment.replyMetadata.comment === comment.uniqid,
            );

            comment.showReplies = false;
          });

          return {
            ...post, commenting: false, comments: noRepliedComments, commentBar: '',
          };
        });

        setPosts(editedPosts);
      } catch (err) {
        console.log(err);
      }
    };

    getProfileInfo();
  }, [uniqid]);

  const [editProfile, setEditProfile] = useState({
    ...accountInfo,
    editting: false,
  });

  const handleNewSendMessage = (message) => {
    setChatMessages([...chatMessages, { message, type: 1 }]);
  };

  const getNoTargets = (targetPostId, targetCommentId = null, targetPostComments = null) => {
    const noTargetPosts = posts.filter((post) => post.uniqid !== targetPostId);

    if (targetCommentId && targetPostComments) {
      const noTargetComments = targetPostComments.filter(
        (comment) => comment.uniqid !== targetCommentId,
      );

      return [noTargetPosts, noTargetComments];
    }

    return [noTargetPosts];
  };

  const sendComment = async (sender, post, comment = null) => {
    if (comment) {
      const commentObj = {
        commentator: {
          uniqid: sender.uniqid,
          name: sender.name,
          comment: comment.uniqid,
        },
        sender: {
          uniqid: sender.uniqid,
          content: comment.commentBar,
          name: sender.name,
        },
        poster: {
          uniqid: post.is_share ? post.shareMetadata.user : sender.uniqid,
          post: post.uniqid,
        },
      };

      console.log(commentObj);

      try {
        const response = await api.post('/comment/reply', commentObj, {
          headers: {
            Authorization: store.getState().user.token,
          },
        });

        return response.data;
      } catch (err) {
        return err;
      }
    }

    const commentObj = {
      sender: {
        uniqid: sender.uniqid,
        content: post.commentBar,
        name: sender.name,
      },
      poster: {
        uniqid: post.is_share ? post.shareMetadata.user : sender.uniqid,
        post: post.uniqid,
      },
    };

    try {
      const response = await api.post('/comment/', commentObj, {
        headers: {
          Authorization: store.getState().user.token,
        },
      });

      return response.data;
    } catch (err) {
      return err;
    }
  };

  const handleCommentting = async (
    targetPost,
    newInfo,
    targetComment = null,
    newComment = false,
  ) => {
    if (targetComment) {
      const [noTargetPosts, noTargetComments] = getNoTargets(
        targetPost.uniqid, targetComment.uniqid, targetPost.comments,
      );

      if (!newComment) {
        const comments = [...noTargetComments, { ...targetComment, ...newInfo }]
          .sort((commentA, commentB) => (commentA.created_at > commentB.created_at ? 1 : -1));

        setPosts([...noTargetPosts, {
          ...targetPost,
          comments,
        }].sort((postA, postB) => (postA.created_at > postB.created_at ? 1 : -1)));
      } else {
        const commentObj = await sendComment({ name, uniqid }, targetPost, targetComment);

        const comments = [...noTargetComments, {
          ...targetComment,
          ...newInfo,
          showReplies: true,
          replies: [...targetComment.replies, commentObj]
            .sort((commentA, commentB) => (commentA.created_at > commentB.created_at ? 1 : -1)),
        }].sort((commentA, commentB) => (commentA.created_at > commentB.created_at ? 1 : -1));

        setPosts([...noTargetPosts, {
          ...targetPost,
          comments,
        }].sort((postA, postB) => (postA.created_at > postB.created_at ? 1 : -1)));
      }
    } else {
      const [noTargetPosts] = getNoTargets(targetPost.uniqid);

      if (!newComment) {
        setPosts([...noTargetPosts, { ...targetPost, ...newInfo }]
          .sort((postA, postB) => (postA.created_at > postB.created_at ? 1 : -1)));
      } else {
        const commentObj = await sendComment({ name, uniqid }, targetPost);

        setPosts([...noTargetPosts,
          {
            ...targetPost,
            ...newInfo,
            comments: [...targetPost.comments, {
              ...commentObj,
              commenting: false,
              commentBar: '',
              replies: [],
              showReplies: false,
            }],
          }]
          .sort((postA, postB) => (postA.created_at > postB.created_at ? 1 : -1)));
      }
    }
  };

  const setShowReplies = (targetComment, targetPost) => {
    const [noTargetPosts, noTargetComments] = getNoTargets(
      targetPost.uniqid, targetComment.uniqid, targetPost.comments,
    );

    const comments = [...noTargetComments,
      { ...targetComment, showReplies: !targetComment.showReplies }]
      .sort((commentA, commentB) => (commentA.created_at > commentB.created_at ? 1 : -1));

    setPosts([...noTargetPosts,
      { ...targetPost, comments }]
      .sort((postA, postB) => (postA.created_at > postB.created_at ? 1 : -1)));
  };

  return (
    <PageContainer>
      <NavBar>
        <ul>
          <li>
            <p>{ `${name}` }</p>
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

          {
            !editProfile.editting && uniqid === userUniqid
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

          { editProfile.editting ? (
            <div className="email">
              <FiMail />
              <input type="email" value={editProfile.email} placeholder="E-mail" onChange={(e) => setEditProfile({ ...editProfile, email: e.target.value })} />
            </div>
          ) : (
            <div className="email">
              <FiMail />
              <p>
                { accountInfo.email }
              </p>
            </div>
          )}

          { editProfile.editting
            ? (
              <div className="birthday">
                <FiCalendar />
                <input type="date" value={new Date(editProfile.birthday)} placeholder="Birthday" onChange={(e) => setEditProfile({ ...editProfile, birthday: e.target.value })} />
              </div>
            ) : (
              <div className="birthday">
                <FiCalendar />
                <p>
                  { accountInfo.birthday }
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
                setEditProfile({ ...editProfile, editting: false });
                setAccountInfo({
                  email: editProfile.email,
                  birthday: editProfile.birthday,
                  bio: editProfile.bio,
                  first_name: editProfile.first_name,
                  last_name: editProfile.last_name,
                });
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
        <div className="feed">
          { posts.map((post) => (
            <Post
              post={post}
              handleCommentting={handleCommentting}
              setShowReplies={setShowReplies}
              key={post.uniqid}
            />
          ))}
        </div>
      </main>
    </PageContainer>
  );
};

export default Profile;
