/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable no-param-reassign */
/* eslint-disable react/no-array-index-key */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {
  useState, useEffect,
} from 'react';
import { useParams } from 'react-router-dom';

import moment from 'moment';

import {
  FriendList,
} from '../../components/StyledComponents';

import NavBar from '../../components/NavBar';
import Chat from '../../components/Chat';
import Feed from '../../components/Feed';
import EditProfile from '../../components/EditProfile';

import api from '../../services/api';

import { PageContainer } from './styles';

const Profile = () => {
  const [chatMessages, setChatMessages] = useState([]);

  const { uniqid } = useParams();

  const [accountInfo, setAccountInfo] = useState({});
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
      } catch (err) {
        console.log(err);
      }
    };

    getProfileInfo();
  }, [uniqid]);

  const handleNewSendMessage = (message) => {
    setChatMessages([...chatMessages, { message, type: 1 }]);
  };

  return (
    <PageContainer>
      <NavBar />
      <FriendList />
      <Chat
        chatMessages={chatMessages}
        handleNewSendMessage={(message) => handleNewSendMessage(message)}
      />
      <EditProfile accountInfo={accountInfo} setAccountInfo={setAccountInfo} />
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
