import styled from 'styled-components';

export const PostContainer = styled.div`
  background-color: #FFF;
  padding: 15px;

  margin-top: 25px;

  display: flex;
  flex-direction: column;

  box-shadow: 5px 5px 7px #888888;

  .author {
    margin-bottom: 3px;

    font-size: 14px;
  }

  .content {
    font-size: 20px;
  }

  .likeAndShare {
    display: flex;
    flex-direction: row;
    justify-content: space-between;

    margin: 10px 0;
  }

  .likeAndShare button {
    margin-top: 10px;

    border: 0;
    outline: 0;
    background: none;

    display: flex;
    flex-direction: row;
    justify-content: flex-end;

    font-size: 16px;
    font-weight: bold;

    cursor: pointer;

    color: #909090;
  }

  .likeAndShare button svg {
    margin-right: 10px;
  }

  .comments {
    padding: 0 5px 10px;
  }

  .comment {
    margin-top: 10px;
  }

  .comments .comment:first-child {
    margin-top: 0;
  }

  .comment .author {
    font-size: 12px;
  }

  .comment p {
    font-size: 14px;
  }

  .comment button a {
    text-decoration: none;
    color: #05ade0;
    font-size: 12px;
  }

  .comment button {
    background: none;
    border: 0;
    outline: 0;

    cursor: pointer;
  }

  .comment .likeAndResponse {
    display: flex;
    flex-direction: row-reverse;
    justify-content: space-between;
    align-items: center;

    margin-top: 8px;
  }

  .likeAndResponse .replyButton {
    color: #909090;
  }

  .commentBar {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .commentBar input {
    width: 98%;
    height: 34px;

    font-size: 16px;
    color: #000;

    border: 0;
    border-bottom: 3px solid #eef;
  }

  .commentBar div {
    margin-top: 10px;

    align-self: flex-end;
  }

  .commentBar div div button:last-child {
    border: 0;
    border-radius: 2px;
    background: #05ade0;
    padding: 6px 8px;

    font-size: 14px;
    color: #fff;

    cursor: pointer;

    margin-left: auto;
  }

  .commentBar div div button:first-child {
    margin-right: 10px;

    border: 0;
    border-radius: 2px;
    color: #05ade0;
    padding: 6px 8px;

    font-size: 14px;
    background-color: #fff;

    cursor: pointer;
  }

  .commentBarResponse {
    margin-top: 5px;

    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .commentBarResponse input {
    width: 98%;
    height: 34px;

    font-size: 16px;
    color: #000;

    border: 0;
    border-bottom: 2px solid #eef;
  }

  .commentBarResponse div {
    margin-top: 5px;

    align-self: flex-end;
  }

  .commentBarResponse div div button:first-child {
    margin-right: 10px;

    border: 0;
    border-radius: 2px;
    color: #05ade0;
    padding: 3px 4px;

    font-size: 12px;
    background-color: #fff;

    cursor: pointer;
  }

  .commentBarResponse div div button:last-child {
    border: 0;
    border-radius: 2px;
    background: #05ade0;
    padding: 3px 4px;

    font-size: 12px;
    color: #fff;

    cursor: pointer;

    margin-left: auto;
  }

  .commentBarResponse input {
    width: 98%;
    height: 24px;

    font-size: 12px;
    color: #000;

    border: 0;
    border-bottom: 3px solid #eef;
  }

  .likeButton {
    margin-left: auto;

    border: 0;
    outline: 0;
    background: none;

    display: flex;
    flex-direction: row;
    justify-content: flex-end;

    font-size: 16px;
    font-weight: bold;

    cursor: pointer;

    color: #909090;
  }

  .likeButton svg {
    margin-right: 10px;
  }

  .repliedComment {
    margin-top: 5px;
    margin-left: 20px;
  }

  .repliedComment .contentAndLike {
    display: flex;
    flex-direction: row;
  }

  .viewReplies {
    display: flex;
    align-items: center;

    color: #2979FF;
    font-size: 14px;

    margin-top: 10px;

    background: none;
    border: 0;
    padding: 0;
  }

  .viewReplies svg {
    margin-right: 3px;
  }

  .shareModal {
    display: none;
    position: fixed;
    z-index: 1;
    padding-top: 100px;
    left: 0;
    top: 0;

    width: 100%;
    height: 100%;

    overflow: auto;

    background-color: rgb(0,0,0);
    background-color: rgba(0,0,0,0.4);
  }

  .shareModal .modalContent {
    margin: auto;
    padding: 15px;
    width: 80%;

    background-color: #FFF;
    box-shadow: 5px 5px 7px #888888;

    max-width: 850px;
  }

  .shareModal .modalContent svg {
    float: right;
    cursor: pointer;
  }

  .shareModal .modalContent .shareBar {
    display: flex;
    flex-direction: column;
    align-items: center;

    padding-top: 18px;
  }

  .shareModal .modalContent .shareBar textarea {
    height: auto;
    width: 98%;
    margin-bottom: 15px;

    font-size: 18px;
    font-family: Roboto,sans-serif;
    color: #000;

    box-sizing: border-box;
    resize: none;
    overflow: hidden;
    border: 0;
    border-bottom: 2px solid #eef;
  }

  .shareModal .modalContent .shareBar div {
    margin-top: 10px;

    align-self: flex-end;
  }

  .shareModal .modalContent .shareBar div div button:first-child {
    margin-right: 10px;

    border: 0;
    border-radius: 2px;
    color: #05ade0;
    padding: 6px 8px;

    font-size: 14px;
    background-color: #fff;

    cursor: pointer;
  }

  .shareModal .modalContent .shareBar div div button:last-child {
    border: 0;
    border-radius: 2px;
    background: #05ade0;
    padding: 6px 8px;

    font-size: 14px;
    color: #fff;

    cursor: pointer;

    margin-left: auto;
  }

  .shareData {
    margin-bottom: 20px;
  }

  .shareData p {
    margin-top: 5px;
    font-size: 14px;
  }
`;
