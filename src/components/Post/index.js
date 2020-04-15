/* eslint-disable no-param-reassign */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useRef } from 'react';

import { useStore } from 'react-redux';

import {
  FiShare2, FiThumbsUp, FiX,
} from 'react-icons/fi';

import {
  IoMdArrowDropdown, IoMdArrowDropup, IoMdThumbsUp,
} from 'react-icons/io';

import { PostContainer } from './styles';

const Post = ({
  post, handleCommentting, setShowReplies, handleLike, handleShare,
}) => {
  const store = useStore();
  const { uniqid } = store.getState().user;

  const [shareText, setShareText] = useState('');

  const shareModal = useRef(null);

  const autosize = (element) => {
    setTimeout(() => {
      element.style.cssText = 'height:auto; padding:0';
      element.style.cssText = `height:${element.scrollHeight}px`;
    }, 0);
  };

  const changeModalDisplay = () => {
    if (shareModal.current.style.display === 'block' && shareModal.current.style.display) {
      shareModal.current.style.display = 'none';
    } else {
      shareModal.current.style.display = 'block';
    }
  };

  return (
    <PostContainer className="post">

      { post.is_share
      && (
      <div className="shareData">
        <strong className="author">{`${post.name}`}</strong>
        <p className="content">{post.content}</p>
      </div>
      )}

      <strong className="author">{post.original ? `${post.original.name}` : `${post.name}`}</strong>
      <p className="content">{post.original ? `${post.original.content}` : `${post.content}`}</p>
      <div className="likeAndShare">
        <button
          type="button"
          className="shareButton"
          onClick={() => { changeModalDisplay(); }}
        >
          <FiShare2 />
          <a>
            Share
          </a>
        </button>

        <button
          type="button"
          className="likeButton"
          onClick={() => (!post.likes.some((like) => like.user === uniqid) ? handleLike(post) : '')}
        >
          { post.likes.some((like) => like.user === uniqid)
            ? <IoMdThumbsUp /> : <FiThumbsUp />}

          <p>
            { post.likes ? post.likes.length : '' }
          </p>
        </button>
      </div>

      <div className="comments">

        { post.comments.map((comment) => (
          <div className="comment" key={comment.uniqid}>
            <strong className="author">{comment.name}</strong>
            <p>{ comment.content }</p>
            <div className="likeAndResponse">
              <button
                type="button"
                className="likeButton"
                onClick={() => (!comment.likes.some((like) => like.user === uniqid) ? handleLike(post, comment) : '')}
              >
                { comment.likes.some((like) => like.user === uniqid)
                  ? <IoMdThumbsUp /> : <FiThumbsUp />}
                <p>
                  { comment.likes ? comment.likes.length : '' }
                </p>
              </button>
              <button type="button" className="replyButton" onClick={() => { handleCommentting(post, { commenting: true }, comment); }}>
                REPLY
              </button>
            </div>

            { comment.replies.length !== 0 && (!comment.showReplies ? (
              <button
                type="button"
                className="viewReplies"
                onClick={() => setShowReplies(comment, post)}
              >
                <IoMdArrowDropdown />
                {' '}
                View
                {' '}
                {comment.replies.length}
                {' '}
                replies
                {' '}
              </button>
            ) : (
              <button
                type="button"
                className="viewReplies"
                onClick={() => setShowReplies(comment, post)}
              >
                <IoMdArrowDropup />
                {' '}
                Hide
                {' '}
                {comment.replies.length}
                {' '}
                replies
                {' '}
              </button>
            ))}

            { comment.showReplies && comment.replies.map((commentReply) => (
              <div className="repliedComment" key={commentReply.uniqid}>
                <strong className="author">{commentReply.name}</strong>
                <div className="contentAndLike">
                  <p>{ commentReply.content }</p>
                  <button
                    type="button"
                    className="likeButton"
                    onClick={() => (!commentReply.likes.some((like) => like.user === uniqid) ? handleLike(post, commentReply) : '')}
                  >
                    { commentReply.likes.some((like) => like.user === uniqid)
                      ? <IoMdThumbsUp /> : <FiThumbsUp />}
                    <p>
                      { commentReply.likes ? commentReply.likes.length : '' }
                    </p>
                  </button>
                </div>
              </div>
            ))}

            { comment.commenting && (
              <div className="commentBarResponse">
                <input type="text" placeholder="Add a Comment" value={comment.commentBar} onChange={(e) => handleCommentting(post, { commentBar: e.target.value }, comment)} />
                <div>
                  <div>
                    <button type="button" onClick={() => { handleCommentting(post, { commenting: false, commentBar: '' }, comment); }}> Cancel </button>
                    <button type="button" onClick={() => { handleCommentting(post, { commenting: false, commentBar: '' }, comment, true); }}> Comment </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="commentBar">
        <input
          type="text"
          placeholder="Add a Comment"
          value={post.commentBar}
          onFocus={() => { handleCommentting(post, { commenting: true }); }}
          onChange={(e) => { handleCommentting(post, { commentBar: e.target.value }); }}
        />
        <div>
          { post.commenting && (
            <div>
              <button type="button" onClick={() => { handleCommentting(post, { commenting: false, commentBar: '' }); }}> Cancel </button>
              <button type="button" onClick={() => { handleCommentting(post, { commenting: false, commentBar: '' }, null, true); }}> Comment </button>
            </div>
          ) }
        </div>
      </div>

      <div className="shareModal" ref={shareModal}>
        <div className="modalContent">
          <FiX onClick={() => { changeModalDisplay(); }} />
          <div className="shareBar">
            <textarea
              placeholder="Say something about this..."
              value={shareText}
              onChange={(e) => { setShareText(e.target.value); }}
              onKeyDown={(e) => autosize(e.target)}
            />
            <div>
              <div>
                <button type="button" onClick={() => { changeModalDisplay(); setShareText(''); }}> Cancel </button>
                <button type="button" onClick={() => { changeModalDisplay(); handleShare(post, shareText); setShareText(''); }}> Share Post </button>
              </div>
            </div>
          </div>
        </div>
      </div>

    </PostContainer>
  );
};


export default Post;
