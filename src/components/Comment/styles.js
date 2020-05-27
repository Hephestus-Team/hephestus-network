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
