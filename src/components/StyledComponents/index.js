import styled from 'styled-components';
import { grayscale } from 'polished';

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
