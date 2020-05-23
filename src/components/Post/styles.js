import styled, { keyframes } from 'styled-components';

const postdropAnimation = keyframes`
  0% {
    height: 0;
    opacity: 0;
  }

  100% {
    height: 90px;
    opacity: 1;
    transform: translateY(0);
  }
`;

export const PostContainer = styled.div`
  background-color: #FFF;
  padding: 15px;

  margin-top: 25px;

  display: flex;
  flex-direction: column;

  box-shadow: 5px 5px 7px #888888;

  position: relative;

  .commentEdit textarea {
    font-size: 14px;
  }

  textarea {
    width: 98%;

    margin-left: -14px;

    font-size: 20px;
    font-family: Roboto, Arial, sans-serif;
    color: #000;

    resize: none;
    overflow: hidden;
    border: 0;
    border-bottom: 2px solid #eef;

    align-self: center;
  }

  .editContentContainer {
    display: flex;
    flex-direction: column;
    align-items: center;

    margin-top: 6px;
  }

  .editContentContainer div {
    margin-top: 10px;

    align-self: flex-end;
  }

  .editContentContainer div div button:last-child {
    border: 0;
    border-radius: 2px;
    background: #05ade0;
    padding: 6px 14px;

    font-size: 14px;
    color: #fff;

    cursor: pointer;

    margin-left: auto;
  }

  .editContentContainer div div button:first-child {
    margin-right: 10px;

    border: 0;
    border-radius: 2px;
    color: #05ade0;
    padding: 6px 8px;

    font-size: 14px;
    background-color: #fff;

    cursor: pointer;
  }

  .mainContainer {
    position: relative;
  }

  .mainContainer:hover .buttonSettings {
    opacity: 0.8;
  }

  .buttonSettings {
    width: 35px;
    height: 35px;
    opacity: 0;

    color: #909090;

    position: absolute;
    top: 0;
    right: 0;

    padding: 5px;

    display: flex;
    justify-content: center;
    align-items: center;

    background: none;
    border: 0;
  }

  .comments .comment .mainContainer .buttonSettings:hover, .buttonSettings:hover {
    cursor: pointer;
    background-color: #E5E6F0;
    border-radius: 50%;
  }

  .comments .comment .mainContainer .buttonSettings:focus, .buttonSettings:focus {
    opacity: 0.8;
    cursor: pointer;
    background-color: #E5E6F0;
    border-radius: 50%;
  }

  .buttonSettings svg {
    width: 18px;
    height: 18px;
  }

  .dropSettings {
    position: absolute;
    z-index: 1;
    right: 0px;
    top: 38px;

    width: auto;
    height: 0;
    opacity: 0;

    display: flex;
    flex-direction: column;

    background: #E3E4E7;

    border-radius: 8%;
    box-shadow: rgba(5, 173, 224, 0.2) 0px 0px 15px, rgba(5, 173, 224, 0.2) 0px 0px 3px 1px;

    text-align: right;
    padding: 8px 0;

    animation: ${postdropAnimation} 0.2s ease-out 0s forwards;
  }

  .dropSettings button {
    background: none;
    border: 0;

    padding-left: 16px;
    padding-right: 36px;

    display: flex;
    align-items: center;

    font-size: 1rem;

    width: 133px;
    height: 36px;

    cursor: pointer;
  }

  .dropSettings button:last-child {
    color: #E0245E;
  }

  .dropSettings button:hover, .comments .comment .mainContainer .dropSettings button:hover {
    background: #ECECEE;
  }

  .dropSettings button p {
    font-size: 16px;
  }

  .dropSettings button svg {
    margin-right: 16px;

    width: 20px;
    height: 20px;
  }

  .authorAndContent.original {
    padding: 15px;

    margin-bottom: 15px;

    border-radius: 10px;
    border: 2px solid #eef;
  }

  .author {
    margin-bottom: 8px;

    font-size: 14px;
  }

  .content {
    font-size: 20px;

    margin: 6px 0;
    margin-right: 40px;
    text-align: justify;
  }

  .likeAndShare {
    display: flex;
    flex-direction: row-reverse;
    justify-content: flex-end;

    margin-bottom: 20px;
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

    cursor: pointer;

    color: #909090;
  }

  .likeAndShare button svg {
    margin-right: 10px;
  }

  .comments {
    padding: 0 5px;
  }

  .comments .comment:first-child {
    margin-top: 0;
  }

  .comment {
    margin-bottom: 16px;
  }

  .comment .mainContainer .author {
    font-size: 13px;

    padding: 2.5px 0;
  }

  .comment .mainContainer .content {
    font-size: 14px;

    padding: 1.5px 0;

    margin-top: 2px;
    margin-bottom: 4px;
  }

  .comment .mainContainer button a {
    text-decoration: none;
    color: #05ade0;
    font-size: 12px;
  }

  .comment .mainContainer button {
    background: none;
    border: 0;
    outline: 0;

    cursor: pointer;
  }

  .comment .mainContainer .likeAndResponse {
    display: flex;
    justify-content: flex-start;
    align-items: center;

    padding: 8px 0;
  }

  .likeAndResponse .replyButton {
    color: #909090;
    font-size: 13px;
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

  .commentBarResponse div {
    margin-top: 5px;

    align-self: flex-end;
  }

  .commentBarResponse div div button:first-child {
    margin-right: 10px;

    border: 0;
    border-radius: 2px;
    color: #05ade0;
    padding: 6px 8px;

    font-size: 12px;
    background-color: #fff;

    cursor: pointer;
  }

  .commentBarResponse div div button:last-child {
    border: 0;
    border-radius: 2px;
    background: #05ade0;
    padding: 6px 8px;

    font-size: 12px;
    color: #fff;

    cursor: pointer;

    margin-left: auto;
  }

  .commentBarResponse input {
    width: 98%;
    height: 34px;

    font-size: 14px;
    color: #000;

    border: 0;
    border-bottom: 2px solid #eef;
  }

  .likeButton {
    margin-right: 24px;

    border: 0;
    outline: 0;
    background: none;

    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;

    font-size: 16px;
    font-weight: bold;

    cursor: pointer;

    color: #909090;
  }

  .likeButton .likeNumber {
    font-size: 13px;
  }

  .likeButton svg {
    padding: 8;
    margin-right: 10px;
  }

  .repliedComment {
    margin-top: 5px;
    margin-left: 20px;
  }

  .viewReplies {
    display: flex;
    align-items: center;

    color: #2979FF;
    font-size: 14px;

    cursor: pointer;

    background: none;
    border: 0;
    padding: 7.5px 0;
  }

  .viewReplies svg {
    margin-right: 8px;
  }

  .shareData {
    margin-bottom: 20px;
  }
`;

export const ShareModal = styled.div`
  display: ${(props) => (props.open ? 'block' : 'none')};
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

  animation: fadeIn 280ms ease-in-out 1;

  @keyframes fadeIn {
    from {
      background-color: rgba(0, 0, 0, 0);
    }
    to {
      background-color: rgba(0,0,0,0.4);
    }
  }

  .modalContent {
    margin: auto;
    padding: 15px;
    width: 30%;
    border-radius: 1%;

    position: relative;

    display: flex;
    flex-direction: column;

    background-color: #FFF;
    box-shadow: 5px 5px 7px #888888;

    max-width: 850px;
  }

  .modalContent .closeButton {
    position: absolute;
    top: 10px;
    right: 10px;

    width: 35px;
    height: 35px;

    color: #909090;

    padding: 5px;

    display: flex;
    justify-content: center;
    align-items: center;

    background: none;
    border: 0;
  }

  .modalContent .closeButton:hover {
    cursor: pointer;
    background-color: #E5E6F0;
    border-radius: 50%;
  }

  .modalContent .closeButton svg {
    width: 80%;
    height: 80%;
  }

  .modalContent .header {
    display: flex;
    justify-content: center;

    padding-top: 5px;
    padding-bottom: 10px;
    border-bottom: 2px solid #eef;
    margin-bottom: 10px;
  }

  .modalContent .textareaContainer {
    margin: 6px 0;
  }

  .modalContent .textareaContainer textarea {
    height: auto;
    width: 100%;
    margin: 0 auto;

    font-size: 18px;
    font-family: Roboto,sans-serif;
    color: #000;

    box-sizing: border-box;
    resize: none;
    overflow: hidden;
    border: 0;
  }

  .modalContent .sharedPost {
    padding: 15px;
    border-radius: 10px;
    border: 2px solid #eef;
  }

  .modalContent .shareButtons {
    margin-top: 10px;

    width: 100%;

    align-self: center;
  }
  .modalContent .shareButtons button {
    border: 0;
    border-radius: 2px;

    background: #05ade0;
    color: #fff;

    width: 100%;

    padding: 10px 14px;

    font-size: 14px;

    cursor: pointer;

    transition: all 0.2s;
  }

  .modalContent .shareButtons button:hover {
    background-color: #037AE2;
  }
`;

export const DeleteModal = styled.div`
  display: block;
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

  animation: fadeIn 280ms ease-in-out 1;

  @keyframes fadeIn {
    from {
      background-color: rgba(0, 0, 0, 0);
    }
    to {
      background-color: rgba(0,0,0,0.4);
    }
  }

  .modalContent {
    margin: auto;
    padding: 15px;
    width: 20%;
    border-radius: 1%;

    background-color: #FFF;
    box-shadow: 5px 5px 7px #888888;

    max-width: 850px;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    text-align: center;
  }

  .modalContent h2 {
    margin-bottom: 10px;

    font-weight: bold;
  }

  .modalContent p {
    color: #888;
  }

  .modalContent div {
    margin-top: 20px;
  }

  .modalContent div button {
    border: 0;
    border-radius: 2px;

    padding: 10px 14px;

    font-size: 14px;

    cursor: pointer;

    transition: all 0.2s;
  }

  .modalContent div button:first-child {
    margin-right: 10px;

    color: #05ade0;
    background-color: #fff;
  }

  .modalContent div button:first-child:hover {
    background: #EEE;
  }

  .modalContent div button:last-child {
    background: #E0245E;
    color: #fff;

    margin-left: auto;
  }

  .modalContent div button:last-child:hover {
    background-color: rgba(224, 36, 94, 0.7);
  }
`;
