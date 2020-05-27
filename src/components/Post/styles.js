import styled from 'styled-components';
import { ButtonSettings } from '../StyledComponents';

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
