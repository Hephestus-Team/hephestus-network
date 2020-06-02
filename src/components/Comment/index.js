import React, { useState } from 'react';

import { useStore } from 'react-redux';

import {
  FiThumbsUp, FiTrash2, FiEdit2,
} from 'react-icons/fi';

import {
  IoMdArrowDropdown, IoMdArrowDropup, IoMdThumbsUp,
} from 'react-icons/io';

import { FaEllipsisV } from 'react-icons/fa';

import AutoSizeTextarea from '../AutoSizeTextarea';

import {
  CommentContainer, ReplyContainer,
} from './styles';

import { DeleteModal, ButtonSettings, DropSettings } from '../StyledComponents';

const Comment = ({
  comment,
  handleCreateComment, handleDeleteComment, handleUpdateComment,
  handleCreateLike, handleDeleteLike,
  setShowReplies, setCommentInteractions,
}) => {
  const store = useStore();
  const { uniqid } = store.getState().user;

  const [showSettings, setShowSettings] = useState({ isShowed: false, uniqid: '' });

  const [openEdit, setOpenEdit] = useState({ isOpened: false, uniqid: '' });
  const [editText, setEditText] = useState('');

  const [openDelete, setOpenDelete] = useState(false);
  return (
    <CommentContainer>

      { (openDelete && comment.uniqid === showSettings.uniqid) && (
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
              <button type="button" onClick={() => { setOpenDelete(false); handleDeleteComment(); }}> Delete </button>
            </div>
          </div>
        </DeleteModal>
      )}

      <article>

        <ButtonSettings
          onClick={() => setShowSettings({
            isShowed: showSettings.uniqid !== comment.uniqid ? true : !showSettings.isShowed,
            uniqid: comment.uniqid,
          })}
        >
          <FaEllipsisV />
        </ButtonSettings>

        { (showSettings.isShowed && showSettings.uniqid === comment.uniqid) && (
        <DropSettings>
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
        </DropSettings>
        )}

        <strong className="author">{comment.name}</strong>

        { (openEdit.isOpened && openEdit.uniqid === comment.uniqid) ? (
          <div className="editContainer">
            <div className="inputContainer">
              <AutoSizeTextarea
                value={editText}
                onChange={(e) => { setEditText(e.target.value); }}
              />
              <span />
            </div>

            <div className="underEditContainer">
              <div className="likeAndReply">
                <button
                  type="button"
                  className="likeButton"
                  onClick={() => (
                    !comment.likes.some((like) => like.user === uniqid)
                      ? handleCreateLike(comment)
                      : handleDeleteLike(comment))}
                >
                  { comment.likes.some((like) => like.user === uniqid)
                    ? <IoMdThumbsUp /> : <FiThumbsUp />}
                  <p>
                    { comment.likes ? comment.likes.length : '' }
                  </p>
                  <span> Like </span>
                </button>

                <button type="button" className="replyButton" onClick={() => { setCommentInteractions({ commenting: true }); }}>
                  REPLY
                </button>
              </div>

              <div className="editButtons">
                <button type="button" onClick={() => { setOpenEdit({ isOpened: false, uniqid: '' }); }}> Cancel </button>
                <button type="button" onClick={() => { setOpenEdit({ isOpened: false, uniqid: '' }); handleUpdateComment(editText); }}> Save </button>
              </div>
            </div>
          </div>
        ) : <p className="content">{comment.original ? `${comment.original.content}` : `${comment.content}`}</p> }

        { !(openEdit.isOpened && openEdit.uniqid === comment.uniqid) && (
          <div className="likeAndReply">
            <button
              type="button"
              className="likeButton"
              onClick={() => (
                !comment.likes.some((like) => like.user === uniqid)
                  ? handleCreateLike(comment)
                  : handleDeleteLike(comment))}
            >
              { comment.likes.some((like) => like.user === uniqid)
                ? <IoMdThumbsUp /> : <FiThumbsUp />}
              <p>
                { comment.likes ? comment.likes.length : '' }
              </p>
              <span> Like </span>
            </button>
            <button type="button" className="replyButton" onClick={() => { setCommentInteractions({ commenting: true }); }}>
              REPLY
            </button>
          </div>
        )}
      </article>

      { comment.commenting && (
      <aside className="replyBar">
        <div className="inputContainer">
          <AutoSizeTextarea
            placeholder="Add a public reply..."
            value={comment.commentBar}
            onChange={(e) => setCommentInteractions({ commentBar: e.target.value })}
          />
          <span />
        </div>

        <div>
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
        </div>
      </aside>
      )}

      { comment.replies.length !== 0 && (!comment.showReplies ? (
        <button
          type="button"
          className="viewReplies"
          onClick={() => setShowReplies()}
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
          onClick={() => setShowReplies()}
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
        <ReplyContainer key={commentReply.uniqid}>

          { (openDelete && commentReply.uniqid === showSettings.uniqid) && (
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
                <button type="button" onClick={() => { setOpenDelete(false); handleDeleteComment(commentReply); }}> Delete </button>
              </div>
            </div>
          </DeleteModal>
          ) }

          <ButtonSettings
            onClick={() => setShowSettings({
              isShowed: showSettings.uniqid !== commentReply.uniqid
                ? true
                : !showSettings.isShowed,
              uniqid: commentReply.uniqid,
            })}
          >
            <FaEllipsisV />
          </ButtonSettings>

          { (showSettings.isShowed && showSettings.uniqid === commentReply.uniqid) && (
          <DropSettings>
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
          </DropSettings>
          )}

          <strong className="author">{commentReply.name}</strong>

          { (openEdit.isOpened && openEdit.uniqid === commentReply.uniqid) ? (
            <div className="editContainer">
              <div className="inputContainer">
                <AutoSizeTextarea
                  value={editText}
                  onChange={(e) => { setEditText(e.target.value); }}
                />
                <span />
              </div>
              <div className="underEditContainer">
                <div className="likeContainer">
                  <button
                    type="button"
                    className="likeButton"
                    onClick={() => (!commentReply.likes.some((like) => like.user === uniqid)
                      ? handleCreateLike(commentReply)
                      : handleDeleteLike(commentReply))}
                  >
                    { commentReply.likes.some((like) => like.user === uniqid)
                      ? <IoMdThumbsUp /> : <FiThumbsUp />}
                    <p>
                      { commentReply.likes ? commentReply.likes.length : '' }
                    </p>
                    <span> Like </span>
                  </button>
                </div>

                <div className="editButtons">
                  <button type="button" onClick={() => { setOpenEdit({ isOpened: false, uniqid: '' }); }}> Cancel </button>
                  <button type="button" onClick={() => { setOpenEdit({ isOpened: false, uniqid: '' }); handleUpdateComment(editText, commentReply); }}> Save </button>
                </div>
              </div>
            </div>
          ) : <p className="content">{commentReply.original ? `${commentReply.original.content}` : `${commentReply.content}`}</p> }

          { !(openEdit.isOpened && openEdit.uniqid === commentReply.uniqid)
          && (
          <div className="likeContainer">
            <button
              type="button"
              className="likeButton"
              onClick={() => (!commentReply.likes.some((like) => like.user === uniqid)
                ? handleCreateLike(commentReply)
                : handleDeleteLike(commentReply))}
            >
              { commentReply.likes.some((like) => like.user === uniqid)
                ? <IoMdThumbsUp /> : <FiThumbsUp />}
              <p>
                { commentReply.likes ? commentReply.likes.length : '' }
              </p>
              <span> Like </span>
            </button>
          </div>
          )}

        </ReplyContainer>
      ))}
    </CommentContainer>
  );
};

export default Comment;
