import styled from 'styled-components';
import { grayscale } from 'polished';

export const NavBar = styled.nav`
  top: 0;
  left: 0;
  position: fixed;

  background-color: #fff;

  margin: 0 0 5vh;
  width: 85vw;
  height: 56px;

  ul {
    padding: 0;
    margin: 0;

    display: grid;
    grid-template-columns: 1fr 3fr 1fr;
    gap: 50px;

    height: 100%;
    list-style: none;
  }

  ul li {
    margin-left: 4vw;

    display: flex;
    flex-direction: row;
    align-items: center;

    width: 100%;
  }

  ul li:last-child {
    margin-left: 0;
  }

  ul li div {
    display: flex;
    flex-direction: row;
    align-items: center;

    border: 2px solid #eee;
    border-radius: 3px;

    width: 100%;
    max-width: 640px;
  }

  ul li div input {
    padding: 12px;
    padding-left: 7px;
    height: 30px;
    width: 100%;
    font-size: 16px;
    border: 0;
    border-right: 2px solid #eee;

    color: #666;
  }

  ul li div button {
    background: 0;
    border: 0;
    outline: 0;

    cursor: pointer;
  }

  ul li div button svg {
    width: 80px;
    height: 25px;
    padding: 2px;

    color: #909090;
  }

  ul li:last-child {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  ul li:last-child button:first-child {
    display: flex;
    justify-content: flex-start;
    align-items: center;

    border: 0;
    border-radius: 2px;
    background: #05ade0;
    padding: 8px 15px;
    margin-right: 20px;

    font-size: 16px;
    font-weight: bold;
    color: #fff;

    cursor: pointer;
    transition: background 0.5s;
  }

  ul li:last-child button:first-child:hover {
    background: #2979FF;
  }

  ul li:last-child button:last-child {
    background: none;
    border: 0;

    cursor: pointer;
  }

  ul li:last-child  button svg {
    margin-right: 6px;

    width: 1rem;
    height: 1rem;
  }

  ul li:first-child button {
      border: 0;
      background: none;
  }

  ul li p {
    display: block;

    color: #909090;
    font-size: 18px;

    margin-right: 10px;

    cursor: pointer;
  }

  @media only screen and (max-width: 1200px) {
    & {
      width: 100vw;
      height: 3rem;
    }

    ul {
      display: grid;
      grid-template-columns: 1fr 3fr 1fr;
    }

    ul li:last-child button {
        margin: 0;
    }
  }

  @media only screen and (max-width: 1200px) {
    & {
      width: 100vw;
      height: 3rem;
    }

    ul {
      display: grid;
      grid-template-columns: 1fr 3fr 1fr;
    }
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
    padding: 1rem;

    display: block;

    color: #050B0F;
    font-size: 18px;
    font-weight: bold;
  }

  @media only screen and (max-width: 1200px) {
    & {
        top: 3rem;
        width: 20vw;
    }

    ul li {
        top: 3rem;
        font-size: 15px;
    }
  }
`;
