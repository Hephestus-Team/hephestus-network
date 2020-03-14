import styled from 'styled-components';
import { grayscale } from 'polished';

export const NavBar = styled.nav`
    top: 0;
    left: 0;
    position: fixed;

    background-color: #fff;

    margin: 0 0 5vh;
    width: 85vw;
    height: 3rem;

    ul {
        padding: 0;
        margin: 0;

        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;

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

    ul li div {
        display: flex;
        flex-direction: row;
        align-items: center;

        border: 2px solid #eee;
        border-radius: 3px;
    }

    ul li div input {
        padding: 12px;

    	height: 1.5rem;
        width: 100%;
    	font-size: 16px;
    	border: 0;
        border-right: 2px solid #eee;

        color: #666;
    }

    ul li div img {
        padding-top: 5px;

        width: 2rem;
        height: 2rem;
    }

    ul li:last-child button {
        margin-left: auto;
        margin-right: 2vw;
    }

    ul li button {
        display: flex;
        justify-content: flex-start;
        align-items: center;

        border: 0;
        border-radius: 2px;
        background: #2979FF;
        padding: 8px 15px;

        font-size: 16px;
        font-weight: bold;
        color: #fff;

        cursor: pointer;
        transition: background 0.5s;   
    }

    ul li button:hover {
        background: #05ade0;
    }

    ul li button img {
        padding-top: 5px;
        margin-right: 6px;

        width: 1rem;
        height: 23px;
    }

    ul li p {
        display: block;

        color: #acacac;
        font-size: 18px;
        font-weight: bold;

        margin-right: 10px;
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

export const Chat = styled.div`
    bottom: 0;
    right: 20vw;
    position: fixed;

    font-size: 14px; 

    background-color: #FFFFFF;
    border-bottom: none;
    border-radius: 10px 10px 0 0;
    width: 20vw;
    height: 7vh;

    display: flex;
    flex-direction: column;
    justify-content: space-between;

    transition: height 300ms ease;

    header {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;

        height: 8vh;
        font-size: 16px;
        font-weight: bold;
        border-radius: 6px 6px 4px 4px;
        
        background: #2979FF;   
        color: #FEFEFF;
    }

    header strong {
        margin: 20px;
    }

    section { 
        overflow: scroll;
        display: none;
    }

    section::-webkit-scrollbar {
        display: none;
    }

    input {
        display: none;
        
        margin: 5px;
        height: 2.5rem;
        font-size: 16px;
        color: #666;
        border: 0;
        border-top: 2px solid #E5E5E5;
        background-color: #FFFFFF;
        padding: 10px 8px;
    }

    section div {
        margin: 20px 15px;
    }

    .user {
        margin-left: auto;
        padding: 10px;
        text-align: right;

        max-width: 50%;
        border-radius: 5px;

        background-color: #2979FF;
        color: #E3EDFF;

        box-shadow: 5px 5px 7px #888888;
    }

    .friendMsg {
        margin-right: auto;
        padding: 10px;
        text-align: left;

        max-width: 50%;
        border-radius: 5px;

        background-color: #F3F3F3;
        color: #565656;

        box-shadow: 5px 5px 7px #888888;
    }

    @media only screen and (min-width: 1150px) and (max-width: 1300px) {
        width: 25vw;
    }

    @media only screen and (min-width: 900px) and (max-width: 1150px) {
        width: 30vw;
    }

    @media only screen and (max-width: 900px) {
        width: 35vw;
    }

    @media only screen and (max-width: 1200px) {
        right: 25vw;
    }
`;