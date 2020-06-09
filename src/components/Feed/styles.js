import styled, { keyframes } from 'styled-components';
import { PostContainer } from '../Post/styles';

const snackBarAnimation = keyframes`
  0% {
    left: -3vh;
  }

  100% {
    transform: translateX(6vh);
  }
`;

export const FeedContainer = styled.main`
  width: 100%;

  display: flex;
  flex-direction: column;
  align-items: center;

  .snackBar {
    position: fixed;
    bottom: 3vh;
    left: -3vh;

    display: flex;
    justify-content: space-between;
    align-items: center;

    background-color: #fff;
    padding: 10px;
    box-shadow: 2px 2px 7px #888888;

    animation: ${snackBarAnimation} 0.3s ease-out 0s forwards;
  }

  .snackBar.delete {
    background-color: #F44336;
  }

  .snackBar.success {
    background-color: #4CAF50;
  }

  .snackBar p {
    color: #fff;
    font-size: 1.4rem;

    margin: 0 10px;
  }

  .snackBar svg {
    color: #fff;
    font-size: 1.6rem;
  }

  .snackBar svg:last-child {
    font-size: 2.5rem;
    cursor: pointer;
  }

  ${PostContainer}:first-child {
    margin-top: 0;
  }

  header.publish {
    background-color: #FFF;
    padding: 15px;

    width: 100%;

    display: flex;
    flex-direction: column;

    box-shadow: 5px 5px 7px #888888;
  }

  header.publish h1 {
    font-size: 2.4rem;
    margin-bottom: 15px;
  }

  header.publish textarea {
    width: 98%;
    margin-bottom: 15px;

    font-size: 1.8rem;
    font-family: Roboto, Arial, sans-serif;
    color: #000;

    resize: none;
    overflow: hidden;
    border: 0;

    align-self: center;
  }

  header.publish button {
    border: 0;
    border-radius: 2px;
    background: #05ade0;
    padding: 6px 18px;
    font-size: 1.5rem;
    color: #fff;
    cursor: pointer;

    align-self: flex-end;
  }
`;
