import styled from 'styled-components';
import { ButtonSettings } from '../StyledComponents';

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
    line-height: 2rem;
    padding: 1.5px 0;
    margin: 2px 40px 4px 0;

    word-wrap: break-word;
    white-space: pre-line;
  }

  div.inputContainer {
    width: 100%;

    position: relative;
  }

  div.inputContainer textarea {
    width: 100%;
    height: 24px;

    font-size: 1.4rem;
    color: #000;

    padding: 0;
    border: 0;
    border-bottom: 2px solid #C4C7C8;

    transition: 0.5s ease border-bottom;
  }

  div.inputContainer span {
    position: absolute;
    bottom: 3px;
    left: 45%;
    z-index: 2;

    height: 2px;
    width: 10px;

    visibility: hidden;

    background-color: #05ade0;
    transition: 0.2s ease all;
  }

  div.inputContainer textarea:focus ~ span {
    visibility: visible;
    width: 100%;
    left: 0;
  }

  div.editContainer {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 6px;
  }

  div.editContainer .inputContainer {
    align-self: flex-start;
  }

  div.editContainer .inputContainer textarea {
    padding-right: 45px;
  }

  div.editContainer div.underEditContainer {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    width: 100%;
  }

  div.editContainer div.underEditContainer div.editButtons button:first-child {
    margin-right: 10px;
    border: 0;
    border-radius: 2px;
    color: #05ade0;
    padding: 6px 8px;
    font-size: 1.3rem;
    background-color: #fff;
    cursor: pointer;
  }

  div.editContainer div.underEditContainer div.editButtons button:last-child {
    border: 0;
    border-radius: 2px;
    background: #05ade0;
    padding: 6px 14px;
    font-size: 1.3rem;
    color: #fff;
    cursor: pointer;
    margin-left: auto;
  }

  div.likeAndReply {
    display: flex;
    justify-content: flex-start;
    align-items: center;

    padding: 8px 0;
  }

  div.likeAndReply button.replyButton {
    color: #909090;
    font-size: 1.3rem;

    background: none;
    border: 0;

    cursor: pointer;
  }

  div.likeAndReply button.likeButton {
    margin-right: 24px;

    position: relative;

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

  div.likeAndReply button.likeButton svg {
    font-size: 1.6rem;
    margin-right: 10px;
  }

  div.likeAndReply button.likeButton p {
    font-size: 1.3rem;
  }

  div.likeAndReply button.likeButton span {
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
    right: 10%;

    transition: 0.2s ease-in all;
  }

  div.likeAndReply button.likeButton svg:hover ~ span {
    visibility: visible;
  }

  aside.replyBar {
    margin-top: 5px;

    display: flex;
    flex-direction: column;
    align-items: center;
  }

  aside.replyBar div:not(.inputContainer) {
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
    line-height: 2rem;
    padding: 1.5px 0;
    margin: 2px 40px 4px 0;

    white-space: pre-line;
    word-wrap: break-word;
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

    color: #000;
    padding-right: 30px;

    border-bottom: 2px solid #C4C7C8;
    align-self: flex-start;
  }

  div.editContainer div.underEditContainer {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    width: 100%;
  }

  div.likeContainer {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding: 8px 0;
  }

  div.likeContainer button.likeButton {
    margin-right: 24px;

    position: relative;

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

  div.likeContainer button.likeButton svg {
    font-size: 1.6rem;
    margin-right: 10px;
  }

  div.likeContainer button.likeButton p {
    font-size: 1.3rem;
  }

  div.likeContainer button.likeButton span {
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
    right: 10%;

    transition: 0.2s ease-in all;
  }

  div.likeContainer button.likeButton svg:hover ~ span {
    visibility: visible;
  }
`;
