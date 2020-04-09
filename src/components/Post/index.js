/* eslint-disable no-param-reassign */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';

import {
  FiShare2, FiThumbsUp,
} from 'react-icons/fi';

import {
  IoMdArrowDropdown, IoMdArrowDropup,
} from 'react-icons/io';

import { PostContainer } from './styles';

const Post = ({
  post, handleCommentting, setShowReplies, handleLike,
}) => (
  <PostContainer className="post" key={post.uniqid}>
    <strong className="author">{`${post.name}`}</strong>
    <p className="content">{post.content}</p>
    <div className="likeAndShare">
      <button
        type="button"
        className="shareButton"
        onClick={() => console.log('AAA')}
      >
        <FiShare2 />
        <a>
          Share
        </a>
      </button>

      <button
        type="button"
        className="likeButton"
        onClick={() => handleLike(post)}
      >
        <FiThumbsUp />
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
              onClick={() => handleLike(post)}
            >
              <FiThumbsUp />
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
                <button type="button" className="likeButton">
                  <FiThumbsUp />
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
  </PostContainer>
);


export default Post;
