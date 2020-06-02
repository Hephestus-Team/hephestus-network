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
    line-height: 2.4rem;

    margin: 6px 0 14px;

    white-space: pre-line;
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
    align-items: flex-start;

    margin-top: 6px;
  }

  div.editContainer textarea {
    width: 98%;

    font-size: 2rem;
    color: #000;

    padding-right: 30px;

    border-bottom: 2px solid rgb(196, 199, 200);

    align-self: flex-start;
  }

  div.editContainer div.underEditContainer {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    width: 100%;
    margin-top: 14px;
  }

  div.editContainer div.underEditContainer div.editButtons button:last-child {
    border: 0;
    border-radius: 2px;
    background: #05ade0;
    padding: 6px 14px;

    font-size: 1.4rem;
    color: #fff;

    cursor: pointer;

    margin-left: auto;
  }

  div.editContainer div.underEditContainer div.editButtons button:first-child {
    margin-right: 10px;

    border: 0;
    border-radius: 2px;
    color: #05ade0;
    padding: 6px 8px;

    font-size: 1.4rem;
    background-color: #fff;

    cursor: pointer;
  }

  div.likeAndShare {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
  }

  div.likeAndShare div button svg {
    margin-right: 10px;
  }

  div.likeAndShare div button.shareButton {
    border: 0;
    background: none;

    display: flex;
    flex-direction: row;
    justify-content: flex-end;

    font-size: 1.6rem;

    cursor: pointer;

    color: #909090;
  }

  div.likeAndShare div button.likeButton {
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

  div.likeAndShare div button.likeButton p {
    font-size: 1.3rem;
  }

  div.likeAndShare div button.likeButton svg {
    font-size: 2rem;
    font-weight: bold;

    padding: 8;
  }

  div.likeAndShare div {
    position: relative;
  }

  div.likeAndShare div span {
    visibility: hidden;

    background: #E3E4E7;
    color: #444;

    text-align: center;
    padding: 8px;

    font-size: 1.3rem;
    font-weight: bold;
    width: auto;

    position: absolute;
    z-index: 1;
    top: 150%;

    transition: 0.2s ease-in all;
  }

  div.likeAndShare div:hover span {
    visibility: visible;
  }

  div.likeAndShare div.shareContainer span {
    right: 10%;
  }

  div.likeAndShare div.likeContainer span {
    left: -20%;
  }

  aside.commentBar {
    display: flex;
    flex-direction: column;
    align-items: center;

    margin-top: 10px;
  }

  aside.commentBar div.inputContainer textarea {
    width: 100%;
    min-height: 24px;

    font-size: 1.4rem;
    color: #000;

    border-bottom: 2px solid #eef;

    transition: 0.5s ease border-bottom;
  }

  aside.commentBar div:not(.inputContainer) {
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

  div.inputContainer {
    width: 98%;

    position: relative;
  }

  div.inputContainer span {
    position: absolute;
    bottom: 0;
    left: 45%;
    z-index: 2;

    height: 2px;
    width: 10px;

    visibility: hidden;

    background-color: #05ade0;
    transition: 0.2s ease all;
  }

  div.inputContainer textarea {
    width: 100%;

    transition: 0.5s ease all;
  }

  div.inputContainer textarea:focus ~ span {
    visibility: visible;
    width: 100%;
    left: 0;
  }

  div.inputContainer textarea ~ span {
    bottom: 3px;
  }

  div.comments {
    padding: 0 5px;
    margin-top: 15px;
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
    color: #000;
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
