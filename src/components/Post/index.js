/* eslint-disable no-param-reassign */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from 'react';

import { useStore } from 'react-redux';

import {
  FiShare2, FiThumbsUp, FiTrash2, FiEdit2,
} from 'react-icons/fi';

import {
  IoMdArrowDropdown, IoMdArrowDropup, IoMdThumbsUp, IoMdClose,
} from 'react-icons/io';

import { FaEllipsisV } from 'react-icons/fa';

import AutoSizeTextarea from '../AutoSizeTextarea';

import {
  PostContainer, ShareModal, DeleteModal,
} from './styles';

const Post = ({
  post, handleCommentting, setShowReplies, handleLike,
  handleUnlike, handleShare, handleDeletePost, handleEditPost,
  handleDeleteComment, handleEditComment,
}) => {
  const store = useStore();
  const { uniqid, name } = store.getState().user;

  const [openShare, setOpenShare] = useState(false);
  const [shareText, setShareText] = useState('');

  const [openDelete, setOpenDelete] = useState(false);

  const [showSettings, setShowSettings] = useState({ isShowed: false, uniqid: '' });

  const [openEdit, setOpenEdit] = useState({ isOpened: false, uniqid: '' });
  const [editText, setEditText] = useState('');

  return (
    <PostContainer className="post">

      <div className="mainContainer">
        <button
          type="button"
          className="buttonSettings"
          onClick={() => setShowSettings({
            isShowed: showSettings.uniqid !== post.uniqid ? true : !showSettings.isShowed,
            uniqid: post.uniqid,
          })}
        >
          <FaEllipsisV />
        </button>

        { (showSettings.isShowed && showSettings.uniqid === post.uniqid) && (
        <div className="dropSettings">
          <button type="button" onClick={() => { setOpenEdit({ isOpened: true, uniqid: post.uniqid }); setEditText(post.content); setShowSettings({ isShowed: false, uniqid: '' }); }}>
            <FiEdit2 />
            <p> Edit </p>
          </button>
          <button type="button" onClick={() => { setOpenDelete(true); }}>
            <FiTrash2 />
            <p> Delete </p>
          </button>
        </div>
        )}

        { post.is_share && (
        <div className="shareData">
          <strong className="author">{`${post.name}`}</strong>
          <p className="content">{post.content}</p>
        </div>
        )}

        <div className={post.original ? 'authorAndContent original' : 'authorAndContent'}>
          <strong className="author">{post.original ? `${post.original.name}` : `${post.name}`}</strong>

          { (openEdit.isOpened && openEdit.uniqid === post.uniqid) ? (
            <div className="editContentContainer">
              <AutoSizeTextarea
                value={editText}
                onChange={(e) => { setEditText(e.target.value); }}
              />
              <div>
                <div>
                  <button type="button" onClick={() => { setOpenEdit({ isOpened: false, uniqid: '' }); }}> Cancel </button>
                  <button type="button" onClick={() => { setOpenEdit({ isOpened: false, uniqid: '' }); handleEditPost(post, editText); }}> Save </button>
                </div>
              </div>
            </div>
          ) : <p className="content">{post.original ? `${post.original.content}` : `${post.content}`}</p> }
        </div>

        <div className="likeAndShare">
          <button
            type="button"
            className="shareButton"
            onClick={() => { setOpenShare(true); }}
          >
            <FiShare2 />
            <a>
              Share
            </a>
          </button>

          <button
            type="button"
            className="likeButton"
            onClick={() => (!post.likes.some((like) => like.user === uniqid)
              ? handleLike(post)
              : handleUnlike(post))}
          >
            { post.likes.some((like) => like.user === uniqid)
              ? <IoMdThumbsUp /> : <FiThumbsUp /> }

            <p>
              { post.likes ? post.likes.length : '' }
            </p>
          </button>
        </div>
      </div>

      <div className="comments">

        { post.comments.map((comment) => (

          <div className="comment" key={comment.uniqid}>

            { (openDelete && comment.uniqid === showSettings.uniqid)
                && (
                  <DeleteModal>
                    <div className="modalContent">
                      <h2>Delete Comment?</h2>
                      <p>
                        This can’t be undone and it will be removed from your profile,
                        the timeline of any accounts that follow you,
                        and from Hephestus search results.
                      </p>
                      <div>
                        <button type="button" onClick={() => { setOpenDelete(false); }}> Cancel </button>
                        <button type="button" onClick={() => { setOpenDelete(false); handleDeleteComment(post, comment); }}> Delete </button>
                      </div>
                    </div>
                  </DeleteModal>
                ) }

            <div className="mainContainer">
              <strong className="author">{comment.name}</strong>

              { (openEdit.isOpened && openEdit.uniqid === comment.uniqid) ? (
                <div className="editContentContainer commentEdit">
                  <AutoSizeTextarea
                    value={editText}
                    onChange={(e) => { setEditText(e.target.value); }}
                  />
                  <div>
                    <div>
                      <button type="button" onClick={() => { setOpenEdit({ isOpened: false, uniqid: '' }); }}> Cancel </button>
                      <button type="button" onClick={() => { setOpenEdit({ isOpened: false, uniqid: '' }); handleEditComment(editText, post, comment); }}> Save </button>
                    </div>
                  </div>
                </div>
              ) : <p className="content">{comment.original ? `${comment.original.content}` : `${comment.content}`}</p> }

              <button
                type="button"
                className="buttonSettings"
                onClick={() => setShowSettings({
                  isShowed: showSettings.uniqid !== comment.uniqid ? true : !showSettings.isShowed,
                  uniqid: comment.uniqid,
                })}
              >
                <FaEllipsisV />
              </button>

              { (showSettings.isShowed && showSettings.uniqid === comment.uniqid) && (
              <div className="dropSettings">
                <button
                  type="button"
                  onClick={() => {
                    setOpenEdit({ isOpened: true, uniqid: comment.uniqid });
                    setEditText(comment.content);
                    setShowSettings({ isShowed: false, uniqid: '' });
                  }}
                >
                  <FiEdit2 />
                  <p> Edit </p>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setOpenDelete(true);
                    setShowSettings({ isShowed: false, uniqid: comment.uniqid });
                  }}
                >
                  <FiTrash2 />
                  <p> Delete </p>
                </button>
              </div>
              )}

              <div className="likeAndResponse">
                <button
                  type="button"
                  className="likeButton"
                  onClick={() => (!comment.likes.some((like) => like.user === uniqid)
                    ? handleLike(post, comment)
                    : handleUnlike(post, comment))}
                >
                  { comment.likes.some((like) => like.user === uniqid)
                    ? <IoMdThumbsUp /> : <FiThumbsUp />}
                  <p className="likeNumber">
                    { comment.likes ? comment.likes.length : '' }
                  </p>
                </button>
                <button type="button" className="replyButton" onClick={() => { handleCommentting(post, { commenting: true }, comment); }}>
                  REPLY
                </button>
              </div>
            </div>

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

            { comment.replies.length !== 0 && (!comment.showReplies ? (
              <button
                type="button"
                className="viewReplies"
                onClick={() => setShowReplies(comment, post)}
              >
                <IoMdArrowDropdown />
                View
                {' '}
                {comment.replies.length}
                {' '}
                replies
              </button>
            ) : (
              <button
                type="button"
                className="viewReplies"
                onClick={() => setShowReplies(comment, post)}
              >
                <IoMdArrowDropup />
                Hide
                {' '}
                {comment.replies.length}
                {' '}
                replies
              </button>
            ))}

            { comment.showReplies && comment.replies.map((commentReply) => (
              <div className="mainContainer repliedComment" key={commentReply.uniqid}>

                { (openDelete && commentReply.uniqid === showSettings.uniqid)
                && (
                  <DeleteModal>
                    <div className="modalContent">
                      <h2>Delete Reply?</h2>
                      <p>
                        This can’t be undone and it will be removed from your profile,
                        the timeline of any accounts that follow you,
                        and from Hephestus search results.
                      </p>
                      <div>
                        <button type="button" onClick={() => { setOpenDelete(false); }}> Cancel </button>
                        <button type="button" onClick={() => { setOpenDelete(false); handleDeleteComment(post, comment, commentReply); }}> Delete </button>
                      </div>
                    </div>
                  </DeleteModal>
                ) }

                <strong className="author">{commentReply.name}</strong>

                { (openEdit.isOpened && openEdit.uniqid === commentReply.uniqid) ? (
                  <div className="editContentContainer commentEdit">
                    <AutoSizeTextarea
                      value={editText}
                      onChange={(e) => { setEditText(e.target.value); }}
                    />
                    <div>
                      <div>
                        <button type="button" onClick={() => { setOpenEdit({ isOpened: false, uniqid: '' }); }}> Cancel </button>
                        <button type="button" onClick={() => { setOpenEdit({ isOpened: false, uniqid: '' }); handleEditComment(editText, post, comment, commentReply); }}> Save </button>
                      </div>
                    </div>
                  </div>
                ) : <p className="content">{commentReply.original ? `${commentReply.original.content}` : `${commentReply.content}`}</p> }

                <button
                  type="button"
                  className="buttonSettings"
                  onClick={() => setShowSettings({
                    isShowed: showSettings.uniqid !== commentReply.uniqid
                      ? true
                      : !showSettings.isShowed,
                    uniqid: commentReply.uniqid,
                  })}
                >
                  <FaEllipsisV />
                </button>

                { (showSettings.isShowed && showSettings.uniqid === commentReply.uniqid) && (
                <div className="dropSettings">
                  <button type="button" onClick={() => { setOpenEdit({ isOpened: true, uniqid: commentReply.uniqid }); setEditText(commentReply.content); setShowSettings({ isShowed: false, uniqid: '' }); }}>
                    <FiEdit2 />
                    <p> Edit </p>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setOpenDelete(true);
                      setShowSettings({ isShowed: false, uniqid: commentReply.uniqid });
                    }}
                  >
                    <FiTrash2 />
                    <p> Delete </p>
                  </button>
                </div>
                )}

                <div className="likeAndResponse">
                  <button
                    type="button"
                    className="likeButton"
                    onClick={() => (!commentReply.likes.some((like) => like.user === uniqid)
                      ? handleLike(post, commentReply)
                      : handleUnlike(post, commentReply))}
                  >
                    { commentReply.likes.some((like) => like.user === uniqid)
                      ? <IoMdThumbsUp /> : <FiThumbsUp />}
                    <p className="likeNumber">
                      { commentReply.likes ? commentReply.likes.length : '' }
                    </p>
                  </button>
                </div>
              </div>
            ))}
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

      <ShareModal open={openShare}>
        <div className="modalContent">
          <button type="button" className="closeButton" onClick={() => { setOpenShare(false); }}>
            <IoMdClose />
          </button>

          <div className="header">
            <h2>
              Write a Publish
            </h2>
          </div>

          <div className="shareAuthor">
            <strong className="author">{name}</strong>
          </div>
          <div className="textareaContainer">
            <AutoSizeTextarea
              placeholder="Say something about this..."
              value={shareText}
              onChange={(e) => { setShareText(e.target.value); }}
            />
          </div>
          <div className="sharedPost">
            <strong className="author">{post.original ? `${post.original.name}` : `${post.name}`}</strong>
            <p className="content">{post.original ? `${post.original.content}` : `${post.content}`}</p>
          </div>
          <div className="shareButtons">
            <button type="button" onClick={() => { setOpenShare(false); handleShare(post, shareText); setShareText(''); }}> Publish </button>
          </div>
        </div>
      </ShareModal>

      { (openDelete && post.uniqid === showSettings.uniqid)
        && (
        <DeleteModal>
          <div className="modalContent">
            <h2>Delete Post?</h2>
            <p>
              This can’t be undone and it will be removed from your profile,
              the timeline of any accounts that follow you,
              and from Hephestus search results.
            </p>
            <div>
              <button type="button" onClick={() => { setOpenDelete(false); }}> Cancel </button>
              <button type="button" onClick={() => { setOpenDelete(false); handleDeletePost(post); }}> Delete </button>
            </div>
          </div>
        </DeleteModal>
        ) }

    </PostContainer>
  );
};


export default Post;
