/* eslint-disable no-param-reassign */
import React, { useState } from 'react';
import { useStore } from 'react-redux';

import {
  FiCheckCircle, FiXCircle,
} from 'react-icons/fi';
import {
  IoMdClose,
} from 'react-icons/io';

import api from '../../services/api';

import Post from '../Post';


import { FeedStyle } from './styles';
import AutoSizeTextarea from '../AutoSizeTextarea';

const Feed = ({ setPosts, posts }) => {
  const [publishText, setPublishText] = useState('');

  const [openSnack, setOpenSnack] = useState(false);

  const store = useStore();

  const { name, uniqid } = store.getState().user;

  const structingPost = (post) => {
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

  const showSnackBar = (type) => {
    setOpenSnack({
      isShow: true,
      type,
    });

    setTimeout(() => setOpenSnack({
      isShow: false,
      type,
    }), 4000);
  };

  const handlePublish = async (publishContent) => {
    if (!publishText) { return; }

    try {
      const response = await api.post('/publish', { content: publishContent, uniqid, name });

      setPosts([
        ...posts,
        structingPost(response.data),
      ].sort((postA, postB) => (postA.created_at < postB.created_at ? 1 : -1)));

      setPublishText('');

      showSnackBar('publish');
    } catch (err) {
      console.error(err);
    }
  };

  const sendComment = async (sender, post, comment = null) => {
    if (comment) {
      const commentObj = {
        commentator: {
          uniqid: comment.user,
          comment: comment.uniqid,
        },
        sender: {
          uniqid: sender.uniqid,
          content: comment.commentBar,
          name: sender.name,
        },
        poster: {
          uniqid: post.poster,
          post: post.uniqid,
        },
      };

      try {
        const response = await api.post('/comment/reply', commentObj);

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
      const response = await api.post('/comment/', commentObj);

      return response.data;
    } catch (err) {
      return err;
    }
  };

  const handleCommentting = async (
    targetPost,
    newCommentData,
    targetComment = null,
    hasNewComment = false,
  ) => {
    if (targetComment) {
      const [noTargetPosts, noTargetComments] = getNoTargets(
        targetPost.uniqid, targetComment.uniqid, targetPost.comments,
      );

      if (!hasNewComment) {
        const comments = [...noTargetComments, { ...targetComment, ...newCommentData }]
          .sort((commentA, commentB) => (commentA.created_at < commentB.created_at ? 1 : -1));


        setPosts([...noTargetPosts, {
          ...targetPost,
          comments,
        }].sort((postA, postB) => (postA.created_at < postB.created_at ? 1 : -1)));
      } else {
        const commentObj = await sendComment(
          {
            name,
            uniqid,
          }, targetPost, targetComment,
        );

        const comments = [...noTargetComments, {
          ...targetComment,
          ...newCommentData,
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

      if (!hasNewComment) {
        setPosts([...noTargetPosts, { ...targetPost, ...newCommentData }]
          .sort((postA, postB) => (postA.created_at < postB.created_at ? 1 : -1)));
      } else {
        const commentObj = await sendComment({ name, uniqid }, targetPost);

        setPosts([...noTargetPosts,
          {
            ...targetPost,
            ...newCommentData,
            comments: [...targetPost.comments, {
              ...commentObj,
              commenting: false,
              commentBar: '',
              replies: [],
              showReplies: false,
            }].sort((commentA, commentB) => (commentA.created_at < commentB.created_at ? 1 : -1)),
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
        commentator: {
          uniqid: comment.user,
          comment: comment.uniqid,
        },
        poster: {
          uniqid: post.poster,
          post: post.uniqid,
        },
        sender: {
          name: sender.name,
        },
      };

      try {
        const response = await api.post('/like/comment', likeObj);

        return response.data;
      } catch (err) {
        return err;
      }
    }

    const likeObj = {
      poster: {
        uniqid: post.poster,
        post: post.uniqid,
      },
      sender: {
        uniqid: sender.uniqid,
        name: sender.name,
      },
    };

    try {
      const response = await api.post('/like/post', likeObj);

      return response.data;
    } catch (err) {
      return err;
    }
  };

  const handleLike = async (targetPost, targetComment = null) => {
    if (targetComment) {
      /* Regular comment */
      if (!targetComment.is_reply) {
        const [noTargetPosts, noTargetComments] = getNoTargets(
          targetPost.uniqid, targetComment.uniqid, targetPost.comments,
        );

        const likedComment = await sendLike({
          name,
          uniqid,
        }, targetPost, targetComment);

        const comments = [
          ...noTargetComments,
          {
            ...likedComment,
            commenting: false,
            commentBar: '',
            replies: [],
            showReplies: false,
          },
        ].sort((commentA, commentB) => (commentA.created_at < commentB.created_at ? 1 : -1));

        setPosts([...noTargetPosts, {
          ...targetPost,
          comments,
        }].sort((postA, postB) => (postA.created_at < postB.created_at ? 1 : -1)));
        /* Replied comment */
      } else {
        const likedReply = await sendLike({
          name,
          uniqid,
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
              likedReply,
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

      const likedPost = await sendLike({ name, uniqid }, targetPost);

      setPosts([...noTargetPosts,
        structingPost(likedPost),
      ].sort((postA, postB) => (postA.created_at < postB.created_at ? 1 : -1)));
    }
  };

  const handleUnlike = async (targetPost, targetComment) => {
    if (targetComment) {
      if (!targetComment.is_reply) {
        await api.delete(`/like/${targetPost.uniqid}/${targetComment.uniqid}/`);

        const [noTargetPosts, noTargetComments] = getNoTargets(
          targetPost.uniqid, targetComment.uniqid, targetPost.comments,
        );

        const comments = [
          ...noTargetComments,
          { ...targetComment, likes: targetComment.likes.filter((like) => like.user !== uniqid) },
        ].sort((commentA, commentB) => (commentA.created_at < commentB.created_at ? 1 : -1));

        setPosts([...noTargetPosts, {
          ...targetPost,
          comments,
        }].sort((postA, postB) => (postA.created_at < postB.created_at ? 1 : -1)));
      } else {
        await api.delete(`/like/${targetPost.uniqid}/${targetComment.uniqid}/`);

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
                likes: targetComment.likes.filter((like) => like.user !== uniqid),
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
      await api.delete(`/like/${targetPost.uniqid}/`);

      const [noTargetPosts] = getNoTargets(targetPost.uniqid);

      setPosts([...noTargetPosts,
        {
          ...targetPost,
          likes: targetPost.likes.filter((like) => like.user !== uniqid),
        }].sort((postA, postB) => (postA.created_at < postB.created_at ? 1 : -1)));
    }
  };

  const handleShare = async (post, content) => {
    const shareObj = {
      poster: {
        uniqid: post.poster,
        name: post.name,
        post: post.uniqid,
      },
      sender: {
        uniqid,
        name,
        content,
      },
    };

    try {
      const response = await api.post('/share', shareObj);

      setPosts([...posts, {
        ...structingPost(response.data.share),
        original: response.data.original,
      }]
        .sort((postA, postB) => (postA.created_at < postB.created_at ? 1 : -1)));

      showSnackBar('share');
    } catch (err) {
      console.log(err);
    }
  };

  const handleDeletePost = async (targetPost) => {
    await api.delete(`/publish/${targetPost.uniqid}/`);

    const [noTargetPosts] = getNoTargets(targetPost.uniqid);

    setPosts([...noTargetPosts]
      .sort((postA, postB) => (postA.created_at < postB.created_at ? 1 : -1)));

    showSnackBar('delete');
  };

  const handleEditPost = async (targetPost, content) => {
    const body = {
      post: {
        content,
        uniqid: targetPost.uniqid,
      },
    };

    const response = await api.patch('/publish/', body);

    const [noTargetPosts] = getNoTargets(targetPost.uniqid);

    setPosts([...noTargetPosts, structingPost(response.data)]
      .sort((postA, postB) => (postA.created_at < postB.created_at ? 1 : -1)));
  };

  const handleDeleteComment = async (targetPost, targetComment, targetReply = null) => {
    const [noTargetPosts, noTargetComments] = getNoTargets(
      targetPost.uniqid, targetComment.uniqid, targetPost.comments,
    );

    if (targetReply) {
      await api.delete(`/comment/${targetReply.uniqid}/`);

      const noTargetReplies = targetComment.replies.filter(
        (reply) => reply.uniqid !== targetReply.uniqid,
      );

      const comments = [
        ...noTargetComments,
        {
          ...targetComment,
          replies: noTargetReplies
            .sort((commentA, commentB) => (commentA.created_at < commentB.created_at ? 1 : -1)),
        },
      ].sort((commentA, commentB) => (commentA.created_at < commentB.created_at ? 1 : -1));

      setPosts([...noTargetPosts, {
        ...targetPost,
        comments,
      }].sort((postA, postB) => (postA.created_at < postB.created_at ? 1 : -1)));
    } else {
      await api.delete(`/comment/${targetComment.uniqid}/`);

      const comments = noTargetComments
        .sort((commentA, commentB) => (commentA.created_at < commentB.created_at ? 1 : -1));

      setPosts([...noTargetPosts, {
        ...targetPost,
        comments,
      }].sort((postA, postB) => (postA.created_at < postB.created_at ? 1 : -1)));
    }
  };

  const handleEditComment = async (content, targetPost, targetComment, targetReply = null) => {
    const body = {
      comment: {
        uniqid: targetReply ? targetReply.uniqid : targetComment.uniqid,
        content,
      },
      post: {
        uniqid: targetPost.uniqid,
      },
    };

    const response = await api.patch('/comment/', body);

    if (targetReply) {
      const [noTargetPosts, noTargetComments] = getNoTargets(
        targetPost.uniqid, targetComment.uniqid, targetPost.comments,
      );

      const noTargetReplies = targetComment.replies.filter(
        (reply) => reply.uniqid !== targetReply.uniqid,
      );

      const comments = [
        ...noTargetComments,
        {
          ...targetComment,
          replies: [
            ...noTargetReplies,
            response.data,
          ].sort((commentA, commentB) => (commentA.created_at < commentB.created_at ? 1 : -1)),
        },
      ].sort((commentA, commentB) => (commentA.created_at < commentB.created_at ? 1 : -1));

      setPosts([...noTargetPosts, {
        ...targetPost,
        comments,
      }].sort((postA, postB) => (postA.created_at < postB.created_at ? 1 : -1)));
    } else {
      const [noTargetPosts, noTargetComments] = getNoTargets(
        targetPost.uniqid, targetComment.uniqid, targetPost.comments,
      );

      const comments = [
        ...noTargetComments,
        {
          ...response.data,
          commenting: false,
          commentBar: '',
          showReplies: targetComment.showReplies,
        },
      ].sort((commentA, commentB) => (commentA.created_at < commentB.created_at ? 1 : -1));

      setPosts([...noTargetPosts, {
        ...targetPost,
        comments,
      }].sort((postA, postB) => (postA.created_at < postB.created_at ? 1 : -1)));
    }
  };

  return (
    <FeedStyle>
      <div className="publish">
        <h1> Create a publish </h1>
        <AutoSizeTextarea
          placeholder="What's happening ?"
          value={publishText}
          onChange={(e) => { setPublishText(e.target.value); }}
        />
        <button
          type="button"
          onClick={() => { handlePublish(publishText); setPublishText(''); }}
        >
          Publish
        </button>
      </div>
      { posts.length !== 0 && posts.map((post) => (
        <Post
          post={post}
          handleCommentting={handleCommentting}
          handleLike={handleLike}
          handleUnlike={handleUnlike}
          handleShare={handleShare}
          handleDeletePost={handleDeletePost}
          handleEditPost={handleEditPost}
          handleDeleteComment={handleDeleteComment}
          handleEditComment={handleEditComment}
          setShowReplies={setShowReplies}
          key={post.uniqid}
        />
      ))}

      { openSnack.isShow && (openSnack.type === 'delete'
        ? (
          <div className="snackBar delete">
            <FiXCircle />
            <p> The publish was deleted </p>
            <IoMdClose onClick={() => { setOpenSnack(false); }} />
          </div>
        )
        : (
          <div className="snackBar success">
            <FiCheckCircle />
            <p> This publish is in your timeline now </p>
            <IoMdClose onClick={() => { setOpenSnack(false); }} />
          </div>
        ))}
    </FeedStyle>
  );
};

export default Feed;
