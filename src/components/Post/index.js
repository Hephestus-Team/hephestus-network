/* eslint-disable no-param-reassign */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from 'react';

import { useStore } from 'react-redux';

import {
  FiShare2, FiThumbsUp, FiTrash2, FiEdit2,
} from 'react-icons/fi';

import {
  IoMdThumbsUp, IoMdClose,
} from 'react-icons/io';

import { FaEllipsisV } from 'react-icons/fa';

import AutoSizeTextarea from '../AutoSizeTextarea';

import {
  PostContainer, ShareModal,
} from './styles';

import { ButtonSettings, DropSettings, DeleteModal } from '../StyledComponents';

import Comment from '../Comment';

const Post = ({
  post,
  setShowReplies, setCommentInteractions,
  handleCreateLike, handleDeleteLike,
  handleCreateShare, handleDeletePost, handleUpdatePost,
  handleCreateComment, handleDeleteComment, handleUpdateComment,
}) => {
  const store = useStore();
  const { uniqid, name } = store.getState().user;

  const [showSettings, setShowSettings] = useState({ isShowed: false, uniqid: '' });

  const [openShare, setOpenShare] = useState(false);
  const [shareText, setShareText] = useState('');

  const [openEdit, setOpenEdit] = useState({ isOpened: false, uniqid: '' });
  const [editText, setEditText] = useState('');

  const [openDelete, setOpenDelete] = useState(false);

  return (
    <PostContainer>
      <article>

        <ButtonSettings
          onClick={() => setShowSettings({
            isShowed: showSettings.uniqid !== post.uniqid ? true : !showSettings.isShowed,
            uniqid: post.uniqid,
          })}
        >
          <FaEllipsisV />
        </ButtonSettings>

        { (showSettings.isShowed && showSettings.uniqid === post.uniqid) && (
          <DropSettings>
            <button type="button" onClick={() => { setOpenEdit({ isOpened: true, uniqid: post.uniqid }); setEditText(post.content); setShowSettings({ isShowed: false, uniqid: '' }); }}>
              <FiEdit2 />
              <p> Edit </p>
            </button>
            <button type="button" onClick={() => { setOpenDelete(true); }}>
              <FiTrash2 />
              <p> Delete </p>
            </button>
          </DropSettings>
        )}

        { post.is_share && (
          <header className="shareData">
            <strong className="author">{`${post.name}`}</strong>
            { (openEdit.isOpened && openEdit.uniqid === post.uniqid) ? (
              <div className="editContainer">
                <AutoSizeTextarea
                  value={editText}
                  onChange={(e) => { setEditText(e.target.value); }}
                />
                <div>
                  <div>
                    <button type="button" onClick={() => { setOpenEdit({ isOpened: false, uniqid: '' }); }}> Cancel </button>
                    <button type="button" onClick={() => { setOpenEdit({ isOpened: false, uniqid: '' }); handleUpdatePost(editText); }}> Save </button>
                  </div>
                </div>
              </div>
            ) : <p className="content">{post.content}</p> }
          </header>
        )}

        <section className={post.original ? 'original' : ''}>
          <strong className="author">{post.original ? `${post.original.name}` : `${post.name}`}</strong>

          { (openEdit.isOpened && openEdit.uniqid === post.uniqid && !post.is_share) ? (
            <div className="editContainer">
              <AutoSizeTextarea
                value={editText}
                onChange={(e) => { setEditText(e.target.value); }}
              />
              <div>
                <div>
                  <button type="button" onClick={() => { setOpenEdit({ isOpened: false, uniqid: '' }); }}> Cancel </button>
                  <button type="button" onClick={() => { setOpenEdit({ isOpened: false, uniqid: '' }); handleUpdatePost(editText); }}> Save </button>
                </div>
              </div>
            </div>
          ) : <p className="content">{post.original ? `${post.original.content}` : `${post.content}`}</p> }
        </section>

        <footer className="likeAndShare">
          <button
            type="button"
            className="likeButton"
            onClick={() => (!post.likes.some((like) => like.user === uniqid)
              ? handleCreateLike()
              : handleDeleteLike()
            )}
          >
            { post.likes.some((like) => like.user === uniqid)
              ? <IoMdThumbsUp /> : <FiThumbsUp /> }

            <p>
              { post.likes ? post.likes.length : '' }
            </p>
          </button>

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
        </footer>

      </article>

      <div className="comments">

        { post.comments.map((comment) => (
          <Comment
            key={comment.uniqid}
            comment={comment}

            setShowReplies={() => setShowReplies(comment)}
            setCommentInteractions={
              (newCommentData) => setCommentInteractions(newCommentData, comment)
            }

            handleCreateLike={handleCreateLike}
            handleDeleteLike={handleDeleteLike}

            handleCreateComment={() => handleCreateComment(comment)}
            handleDeleteComment={
              (targetReply = null) => handleDeleteComment(comment, targetReply)
            }
            handleUpdateComment={
              (newContent, targetReply = null) => handleUpdateComment(newContent, comment, targetReply)
            }
          />
        ))}
      </div>

      <aside className="commentBar">
        <input
          type="text"
          placeholder="Add a Comment"
          value={post.commentBar}
          onFocus={() => { setCommentInteractions({ commenting: true }); }}
          onChange={(e) => { setCommentInteractions({ commentBar: e.target.value }); }}
        />
        <div>
          { post.commenting && (
            <div>
              <button type="button" onClick={() => { setCommentInteractions({ commenting: false, commentBar: '' }); }}> Cancel </button>
              <button
                type="button"
                onClick={() => {
                  handleCreateComment();
                }}
              >
                Comment
              </button>
            </div>
          ) }
        </div>
      </aside>

      { openShare && (
        <ShareModal>
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

            <div className="publishButtonContainer">
              <button type="button" onClick={() => { setOpenShare(false); handleCreateShare(shareText); setShareText(''); }}> Publish </button>
            </div>

          </div>
        </ShareModal>
      )}

      { (openDelete && post.uniqid === showSettings.uniqid) && (
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
