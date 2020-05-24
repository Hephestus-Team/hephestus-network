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

export const ButtonSettings = styled.button`
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

  &:hover {
    cursor: pointer;
    background-color: #E5E6F0;
    border-radius: 50%;
  }

  &:focus {
    opacity: 0.8;
    cursor: pointer;
    background-color: #E5E6F0;
    border-radius: 50%;
  }

  svg {
    width: 18px;
    height: 18px;
  }
`;

export const DropSettings = styled.div`
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

  button {
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

  button:last-child {
    color: #E0245E;
  }

  button:hover {
    background: #ECECEE;
  }

  button p {
    font-size: 1.6rem;
  }

  button svg {
    margin-right: 16px;

    width: 20px;
    height: 20px;
  }
`;

export const PostContainer = styled.section`
  background-color: #FFF;
  padding: 15px;

  width: 100%;

  margin-top: 25px;

  display: flex;
  flex-direction: column;

  box-shadow: 5px 5px 7px #888888;

  position: relative;

  article:hover ${ButtonSettings} {
    opacity: 0.8;
  }

  article {
    position: relative;
  }

  header.shareData {
    margin-bottom: 20px;
  }

  strong.author {
    margin-bottom: 8px;

    font-size: 1.4rem;
  }

  p.content {
    font-size: 2rem;

    margin: 6px 40px 14px 0;
  }

  section.original {
    padding: 15px;

    margin-bottom: 15px;

    border-radius: 10px;
    border: 2px solid #eef;
  }

  div.editContainer {
    display: flex;
    flex-direction: column;
    align-items: center;

    margin-top: 6px;
  }

  div.editContainer div {
    margin-top: 10px;

    align-self: flex-end;
  }

  div.editContainer div div button:last-child {
    border: 0;
    border-radius: 2px;
    background: #05ade0;
    padding: 6px 14px;

    font-size: 1.4rem;
    color: #fff;

    cursor: pointer;

    margin-left: auto;
  }

  div.editContainer div div button:first-child {
    margin-right: 10px;

    border: 0;
    border-radius: 2px;
    color: #05ade0;
    padding: 6px 8px;

    font-size: 1.4rem;
    background-color: #fff;

    cursor: pointer;
  }

  div.editContainer textarea {
    width: 98%;

    font-size: 2rem;
    font-family: Roboto, Arial, sans-serif;
    color: #000;

    padding-right: 30px;

    resize: none;
    overflow: hidden;
    border: 0;
    border-bottom: 2px solid #eef;

    align-self: flex-start;
  }

  footer.likeAndShare {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;

    margin-bottom: 20px;
  }

  footer.likeAndShare button svg {
    margin-right: 10px;
  }

  footer.likeAndShare button.shareButton {
    border: 0;
    background: none;

    display: flex;
    flex-direction: row;
    justify-content: flex-end;

    font-size: 1.6rem;

    cursor: pointer;

    color: #909090;
  }

  footer.likeAndShare button.likeButton {
    margin-right: 24px;

    border: 0;
    background: none;

    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;

    font-weight: bold;

    cursor: pointer;

    color: #909090;
  }

  footer.likeAndShare button.likeButton p {
    font-size: 1.3rem;
  }

  footer.likeAndShare button.likeButton svg {
    font-size: 2rem;
    font-weight: bold;
  }

  aside.commentBar {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  aside.commentBar input {
    width: 98%;
    height: 34px;

    font-size: 1.6rem;
    color: #000;

    border: 0;
    border-bottom: 3px solid #eef;
  }

  aside.commentBar div {
    margin-top: 10px;

    align-self: flex-end;
  }

  aside.commentBar div div button:last-child {
    border: 0;
    border-radius: 2px;
    background: #05ade0;
    padding: 6px 8px;

    font-size: 1.4rem;
    color: #fff;

    cursor: pointer;

    margin-left: auto;
  }

  aside.commentBar div div button:first-child {
    margin-right: 10px;

    border: 0;
    border-radius: 2px;
    color: #05ade0;
    padding: 6px 8px;

    font-size: 1.4rem;
    background-color: #fff;

    cursor: pointer;
  }

  div.comments {
    padding: 0 5px;
  }
`;

export const CommentContainer = styled.section`
  margin-bottom: 16px;

  article:hover ${ButtonSettings} {
    opacity: 0.8;
  }

  article {
    position: relative;
  }

  strong.author {
    font-size: 1.3rem;
    padding: 2.5px 0;
    margin-bottom: 8px;
  }

  p.content {
    font-size: 1.4rem;
    padding: 1.5px 0;
    margin: 2px 40px 4px 0;
  }

  div.editContainer {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 6px;
  }

  div.editContainer textarea {
    font-size: 1.4rem;
    width: 98%;
    font-family: Roboto,Arial,sans-serif;
    color: #000;
    padding-right: 30px;
    resize: none;
    overflow: hidden;
    border: 0;
    border-bottom: 2px solid #eef;
    align-self: flex-start;
  }

  div.editContainer div {
    margin-top: 10px;
    flex-direction: row;
    align-self: flex-end;
  }

  div.editContainer div div button:first-child {
    margin-right: 10px;
    border: 0;
    border-radius: 2px;
    color: #05ade0;
    padding: 6px 8px;
    font-size: 1.4rem;
    background-color: #fff;
    cursor: pointer;
  }

  div.editContainer div div button:last-child {
    border: 0;
    border-radius: 2px;
    background: #05ade0;
    padding: 6px 14px;
    font-size: 1.4rem;
    color: #fff;
    cursor: pointer;
    margin-left: auto;
  }

  footer.likeAndReply {
    display: flex;
    justify-content: flex-start;
    align-items: center;

    padding: 8px 0;
  }

  footer.likeAndReply button.replyButton {
    color: #909090;
    font-size: 1.3rem;

    background: none;
    border: 0;

    cursor: pointer;
  }

  footer.likeAndReply button.likeButton {
    margin-right: 24px;

    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;

    background: none;
    border: 0;

    font-weight: bold;
    color: #909090;

    cursor: pointer;
  }

  footer.likeAndReply button.likeButton svg {
    font-size: 1.6rem;
    margin-right: 10px;
  }

  footer.likeAndReply button.likeButton p {
    font-size: 1.3rem;
  }

  aside.replyBar {
    margin-top: 5px;

    display: flex;
    flex-direction: column;
    align-items: center;
  }

  aside.replyBar div {
    margin-top: 5px;

    align-self: flex-end;
  }

  aside.replyBar div div button:first-child {
    margin-right: 10px;

    border: 0;
    border-radius: 2px;
    color: #05ade0;
    padding: 6px 8px;

    font-size: 1.2rem;
    background-color: #fff;

    cursor: pointer;
  }

  aside.replyBar div div button:last-child {
    border: 0;
    border-radius: 2px;
    background: #05ade0;
    padding: 6px 8px;

    font-size: 1.2rem;
    color: #fff;

    cursor: pointer;

    margin-left: auto;
  }

  aside.replyBar input {
    width: 98%;
    height: 34px;

    font-size: 1.4rem;
    color: #000;

    border: 0;
    border-bottom: 2px solid #eef;
  }

  button.viewReplies {
    display: flex;
    align-items: center;

    color: #2979FF;
    font-size: 1.4rem;

    cursor: pointer;

    background: none;
    border: 0;
    padding: 7.5px 0;
  }

  button.viewReplies svg {
    margin-right: 8px;
  }
`;

export const ReplyContainer = styled.div`
  margin-top: 5px;
  margin-left: 20px;

  position: relative;

  &:hover ${ButtonSettings} {
    opacity: 0.8;
  }

  strong.author {
    font-size: 1.3rem;
    padding: 2.5px 0;
    margin-bottom: 8px;
  }

  p.content {
    font-size: 1.4rem;
    padding: 1.5px 0;
    margin: 2px 40px 4px 0;
  }

  footer.likeContainer {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding: 8px 0;
  }

  footer.likeContainer button.likeButton {
    margin-right: 24px;

    display: flex;

    flex-direction: row;

    align-items: center;

    justify-content: flex-end;

    font-weight: bold;
    color: #909090;

    background: none;
    border: 0;
    cursor: pointer;
  }

  footer.likeContainer button.likeButton svg {
    font-size: 1.6rem;
    margin-right: 10px;
  }

  footer.likeContainer button.likeButton p {
    font-size: 1.3rem;
  }

  div.editContainer {
    display: flex;

    flex-direction: column;

    align-items: center;
    margin-top: 6px;
  }

  div.editContainer textarea {
    font-size: 1.4rem;
    width: 98%;

    font-family: Roboto,Arial,sans-serif;
    color: #000;
    padding-right: 30px;
    resize: none;
    overflow: hidden;
    border: 0;
    border-bottom: 2px solid #eef;
    align-self: flex-start;
  }
`;

export const ShareModal = styled.div`
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

  div.modalContent {
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

  div.modalContent button.closeButton {
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

  div.modalContent button.closeButton:hover {
    cursor: pointer;
    background-color: #E5E6F0;
    border-radius: 50%;
  }

  div.modalContent button.closeButton svg {
    width: 80%;
    height: 80%;
  }

  div.modalContent div.header {
    display: flex;
    justify-content: center;

    font-size: 1.6rem;

    padding-top: 5px;
    padding-bottom: 10px;
    border-bottom: 2px solid #eef;
    margin-bottom: 10px;
  }

  div.modalContent div.textareaContainer {
    margin: 6px 0;
  }

  div.modalContent div.textareaContainer textarea {
    height: auto;
    width: 100%;
    margin: 0 auto;

    font-size: 1.8rem;
    font-family: Roboto,sans-serif;
    color: #000;

    box-sizing: border-box;
    resize: none;
    overflow: hidden;
    border: 0;
  }

  div.modalContent div.sharedPost {
    padding: 15px;
    border-radius: 10px;
    border: 2px solid #eef;
  }

  div.modalContent div.publishButtonContainer {
    margin-top: 10px;

    width: 100%;

    align-self: center;
  }

  div.modalContent div.publishButtonContainer button {
    border: 0;
    border-radius: 2px;

    background: #05ade0;
    color: #fff;

    width: 100%;

    padding: 10px 14px;

    font-size: 1.4rem;

    cursor: pointer;

    transition: all 0.2s;
  }

  div.modalContent div.publishButtonContainer button:hover {
    background-color: rgba(5, 173, 224, 0.9);
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

  div.modalContent {
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

  div.modalContent h2 {
    margin-bottom: 10px;

    font-weight: bold;
  }

  div.modalContent p {
    color: #888;
  }

  div.modalContent div {
    margin-top: 20px;
  }

  div.modalContent div button {
    border: 0;
    border-radius: 2px;

    padding: 10px 14px;

    font-size: 1.4rem;

    cursor: pointer;

    transition: all 0.2s;
  }

  div.modalContent div button:first-child {
    margin-right: 10px;

    color: #05ade0;
    background-color: #fff;
  }

  div.modalContent div button:first-child:hover {
    background: #EEE;
  }

  div.modalContent div button:last-child {
    background: #E0245E;
    color: #fff;

    margin-left: auto;
  }

  div.modalContent div button:last-child:hover {
    background-color: rgba(224, 36, 94, 0.7);
  }
`;
