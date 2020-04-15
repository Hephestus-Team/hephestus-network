/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable no-param-reassign */
/* eslint-disable react/no-array-index-key */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {
  useState, useEffect, useContext, useRef,
} from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useStore } from 'react-redux';
import {
  FiLogOut, FiCalendar,
} from 'react-icons/fi';

import {
  AiOutlineSearch,
} from 'react-icons/ai';

import {
  GoGear,
} from 'react-icons/go';

import moment from 'moment';

import {
  NavBar, FriendList,
} from '../../components/StyledComponents';

import ConfigDialog from '../../components/ConfigDialog';
import Chat from '../../components/Chat';
import Post from '../../components/Post';

import api from '../../services/api';

import PersistContext from '../../persistContext';

import defaultProfile from '../../assets/images/defaultProfile.png';
import { PageContainer } from './styles';

const Profile = () => {
  const [chatMessages, setChatMessages] = useState([]);
  const [searchBar, setSearchBar] = useState('');
  const [publishText, setPublishText] = useState('');

  const { uniqid } = useParams();
  const store = useStore();
  const persistor = useContext(PersistContext);
  const history = useHistory();

  const [accountInfo, setAccountInfo] = useState({});
  const [editProfile, setEditProfile] = useState({});
  const [posts, setPosts] = useState([]);

  const configDialog = useRef(null);

  const { name, uniqid: userUniqid } = store.getState().user;

  const changeModalDisplay = () => {
    if (configDialog.current.style.display === 'block' && configDialog.current.style.display) {
      configDialog.current.style.display = 'none';
    } else {
      configDialog.current.style.display = 'block';
    }
  };

  const structingPosts = (responsePosts) => {
    const editedPosts = responsePosts.map((post) => {
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

    return editedPosts.sort((postA, postB) => (postA.created_at < postB.created_at ? 1 : -1));
  };

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

        accountData.birthday = moment(accountData.birthday);

        console.log(response.data);

        setAccountInfo(accountData);

        setEditProfile({
          ...accountData,
          editting: false,
        });

        setPosts(structingPosts(response.data.posts));
      } catch (err) {
        console.log(err);
      }
    };

    getProfileInfo();
  }, [uniqid, store]);

  const handleEditProfile = async () => {
    if (editProfile.first_name !== '' && editProfile.last_name !== '' && editProfile.birthday !== '') {
      const response = await api.patch(`/u/${uniqid}`, {
        user: {
          first_name: editProfile.first_name,
          last_name: editProfile.last_name,
          bio: editProfile.bio,
          birthday: editProfile.birthday,
          username: editProfile.username,
        },
      }, {
        headers: {
          Authorization: store.getState().user.token,
          u: store.getState().user.uniqid,
        },
      });

      console.log(response.data);

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

  const handlePublish = async (publishContent) => {
    try {
      const response = await api.post('/publish', { content: publishContent, uniqid: userUniqid, name }, {
        headers: {
          Authorization: store.getState().user.token,
        },
      });

      setPosts([
        ...posts,
        response.data,
      ].sort((postA, postB) => (postA.created_at < postB.created_at ? 1 : -1)));

      setPublishText('');
    } catch (err) {
      console.error(err);
    }
  };

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
          .sort((commentA, commentB) => (commentA.created_at < commentB.created_at ? 1 : -1));

        setPosts([...noTargetPosts, {
          ...targetPost,
          comments,
        }].sort((postA, postB) => (postA.created_at < postB.created_at ? 1 : -1)));
      } else {
        const commentObj = await sendComment(
          {
            name,
            uniqid: accountInfo.uniqid,
          }, targetPost, targetComment,
        );

        const comments = [...noTargetComments, {
          ...targetComment,
          ...newInfo,
          showReplies: true,
          replies: [...targetComment.replies, commentObj]
            .sort((commentA, commentB) => (commentA.created_at < commentB.created_at ? 1 : -1)),
        }].sort((commentA, commentB) => (commentA.created_at < commentB.created_at ? 1 : -1));

        setPosts([...noTargetPosts, {
          ...targetPost,
          comments,
        }].sort((postA, postB) => (postA.created_at < postB.created_at ? 1 : -1)));
      }
    } else {
      const [noTargetPosts] = getNoTargets(targetPost.uniqid);

      if (!newComment) {
        setPosts([...noTargetPosts, { ...targetPost, ...newInfo }]
          .sort((postA, postB) => (postA.created_at < postB.created_at ? 1 : -1)));
      } else {
        const commentObj = await sendComment({ name, uniqid: accountInfo.uniqid }, targetPost);

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
          .sort((postA, postB) => (postA.created_at < postB.created_at ? 1 : -1)));
      }
    }
  };

  const setShowReplies = (targetComment, targetPost) => {
    const [noTargetPosts, noTargetComments] = getNoTargets(
      targetPost.uniqid, targetComment.uniqid, targetPost.comments,
    );

    const comments = [...noTargetComments,
      { ...targetComment, showReplies: !targetComment.showReplies }]
      .sort((commentA, commentB) => (commentA.created_at < commentB.created_at ? 1 : -1));

    setPosts([...noTargetPosts,
      { ...targetPost, comments }]
      .sort((postA, postB) => (postA.created_at < postB.created_at ? 1 : -1)));
  };

  const sendLike = async (sender, post, comment = null) => {
    if (comment) {
      const likeObj = {
        poster: post.poster,
        post: post.uniqid,
        comment: comment.uniqid,
        sender: sender.uniqid,
        name: sender.name,
      };

      console.log(likeObj);

      try {
        const response = await api.post('/like/comment', likeObj, {
          headers: {
            Authorization: store.getState().user.token,
          },
        });

        return response.data;
      } catch (err) {
        return err;
      }
    }

    const likeObj = {
      poster: post.poster,
      post: post.uniqid,
      sender: sender.uniqid,
      name: sender.name,
    };

    try {
      const response = await api.post('/like/post', likeObj, {
        headers: {
          Authorization: store.getState().user.token,
        },
      });

      return response.data;
    } catch (err) {
      return err;
    }
  };

  const handleLike = async (targetPost, targetComment = null) => {
    if (targetComment) {
      if (!targetComment.is_reply) {
        const [noTargetPosts, noTargetComments] = getNoTargets(
          targetPost.uniqid, targetComment.uniqid, targetPost.comments,
        );

        const likeObj = await sendLike({
          name,
          uniqid: accountInfo.uniqid,
        }, targetPost, targetComment);

        const comments = [
          ...noTargetComments,
          { ...targetComment, likes: [...targetComment.likes, likeObj] },
        ].sort((commentA, commentB) => (commentA.created_at < commentB.created_at ? 1 : -1));

        setPosts([...noTargetPosts, {
          ...targetPost,
          comments,
        }].sort((postA, postB) => (postA.created_at < postB.created_at ? 1 : -1)));
      } else {
        const likeObj = await sendLike({
          name,
          uniqid: accountInfo.uniqid,
        }, targetPost, targetComment);

        const noRepliedComment = targetPost.comments.filter(
          (comment) => comment.uniqid === targetComment.replyMetadata.comment,
        )[0];

        const [noTargetPosts, noTargetComments] = getNoTargets(
          targetPost.uniqid, noRepliedComment.uniqid, targetPost.comments,
        );

        const noTargetReplies = noRepliedComment.replies.filter(
          (reply) => reply.uniqid !== targetComment.uniqid,
        );

        const comments = [
          ...noTargetComments,
          {
            ...noRepliedComment,
            replies: [
              ...noTargetReplies,
              {
                ...targetComment,
                likes: [...targetComment.likes, likeObj],
              },
            ].sort((commentA, commentB) => (commentA.created_at < commentB.created_at ? 1 : -1)),
          },
        ].sort((commentA, commentB) => (commentA.created_at < commentB.created_at ? 1 : -1));

        setPosts([...noTargetPosts, {
          ...targetPost,
          comments,
        }].sort((postA, postB) => (postA.created_at < postB.created_at ? 1 : -1)));
      }
    } else {
      const [noTargetPosts] = getNoTargets(targetPost.uniqid);

      const likeObj = await sendLike({ name, uniqid: accountInfo.uniqid }, targetPost);

      setPosts([...noTargetPosts,
        {
          ...targetPost,
          likes: [...targetPost.likes, likeObj],
        }].sort((postA, postB) => (postA.created_at < postB.created_at ? 1 : -1)));
    }
  };

  const handleShare = async (post, content) => {
    const shareObj = post.is_share ? {
      poster: {
        uniqid: post.shareMetadata.user,
        name: post.shareMetadata.name,
        post: post.shareMetadata.post,
      },
      sender: {
        uniqid: userUniqid,
        name,
        content,
      },
    } : {
      poster: {
        uniqid: post.poster,
        name: post.name,
        post: post.uniqid,
      },
      sender: {
        uniqid: userUniqid,
        name,
        content,
      },
    };

    try {
      const response = await api.post('/share', shareObj, {
        headers: {
          Authorization: store.getState().user.token,
        },
      });

      console.log(response.data);

      setPosts([...posts, response.data]
        .sort((postA, postB) => (postA.created_at < postB.created_at ? 1 : -1)));
    } catch (err) {
      console.log(err);
    }
  };

  const autosize = (element) => {
    setTimeout(() => {
      element.style.cssText = 'height:auto; padding:0';
      element.style.cssText = `height:${element.scrollHeight}px`;
    }, 0);
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

            <button
              type="button"
              onClick={() => changeModalDisplay()}
            >
              <GoGear />
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
          <div className="publish">
            <h1> Create a publish </h1>
            <textarea
              placeholder="What's happening ?"
              value={publishText}
              onChange={(e) => { setPublishText(e.target.value); }}
              onKeyDown={(e) => autosize(e.target)}
            />
            <button
              type="button"
              onClick={() => { handlePublish(publishText); setPublishText(''); }}
            >
              Publish
            </button>
          </div>
          { posts.map((post) => (
            <Post
              post={post}
              handleCommentting={handleCommentting}
              handleLike={handleLike}
              handleShare={handleShare}
              setShowReplies={setShowReplies}
              key={post.uniqid}
            />
          ))}
        </div>
      </main>
      <ConfigDialog
        forwardRef={configDialog}
      />
    </PageContainer>
  );
};

export default Profile;
