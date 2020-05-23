import styled, { keyframes } from 'styled-components';

const snackBarAnimation = keyframes`
  0% {
    left: -3vh;
  }

  100% {
    transform: translateX(6vh);
  }
`;

export const FeedStyle = styled.div`
  width: 100%;

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
    font-size: 14px;

    margin: 0 10px;
  }

  .snackBar svg {
    color: #fff;
  }

  .snackBar svg:last-child {
    font-size: 25px;
    cursor: pointer;
  }

  .post:first-child {
    margin-top: 0;
  }

  .publish {
    background-color: #FFF;
    padding: 15px;

    display: flex;
    flex-direction: column;

    box-shadow: 5px 5px 7px #888888;
  }

  .publish h1 {
    font-size: 24px;
    margin-bottom: 15px;
  }

  .publish textarea {
    width: 98%;
    margin-bottom: 15px;

    font-size: 18px;
    font-family: Roboto, Arial, sans-serif;
    color: #000;

    resize: none;
    overflow: hidden;
    border: 0;

    align-self: center;
  }

  .publish button {
    border: 0;
    border-radius: 2px;
    background: #05ade0;
    padding: 6px 18px;
    font-size: 15px;
    color: #fff;
    cursor: pointer;

    align-self: flex-end;
  }
`;
