import styled, { keyframes } from 'styled-components';
import { grayscale } from 'polished';

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
  z-index: 1;

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
    padding: 30px 20px;
    width: 320px;
    height: 230px;
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

    font-size: 2.6rem;
    font-weight: bold;
  }

  div.modalContent p {
    color: #888;

    font-size: 1.6rem;
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

export const FriendList = styled.div`
  top: 0;
  right: 0;
  position: fixed;

  background-color: ${grayscale('rgba(256,256,256,0.7)')};

  z-index: 1;

  width: 15vw;
  height: 100%;
  border: 3px solid #eee;
  overflow: scroll;

  font-size: 12px;

  &::-webkit-scrollbar {
      display: none;
  }

  ul {
    display: flex;
    flex-direction: column;
    align-items: center;

    list-style: none;
    padding: 0;
    margin: 0;

    height: 100%;
  }

  ul li {
    text-align: center;

    width: 100%;
    padding: 16px;

    display: block;

    color: #050B0F;
    font-size: 18px;
    font-weight: bold;
  }

  @media only screen and (max-width: 1200px) {
    & {
        top: 48px;
        width: 20vw;
    }

    ul li {
        top: 48px;
        font-size: 15px;
    }
  }
`;
