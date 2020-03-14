import React, { useRef, useState, useEffect } from 'react';

import { Chat, NavBar, FriendList } from './styles';

import { receiveNewMessage, sendNewMessage, connect, disconnect } from '../../services/socket.js';

import searchIcon from '../../assets/icons/searchIcon.svg';
import logoutIcon from '../../assets/icons/logoutIcon.svg';

const Home = () => {

    const chat = useRef(null);

    const [chatMessages, setChatMessages] = useState([]);

    useEffect(() => {
        receiveNewMessage(messageText => setChatMessages([...chatMessages, {messageText, type: 0}]));
    }, [chatMessages])

    const changeChatExpansion = (chatStyle) => {
        const elements = Array.from(chat.current.children).filter((element) => element.nodeName !== "HEADER");

        if(chatStyle.height === '50vh') {
            chatStyle.height = '7vh';
            elements.forEach(element => element.style.display = 'none');
        }
        else {
            chatStyle.height = '50vh'; 
            elements.forEach(element => element.style.display = 'initial');
        }         
    };

    const handleNewSendMessage = (messageText) => {
        sendNewMessage(messageText);
        setChatMessages([...chatMessages, {messageText, type: 1}]);
    };

    return (
        <>
            <NavBar>
                <ul>         
                    <li>
                        <p>Shinzein</p>
                    </li>
                    <li>
                        <p>Search</p>
                        <div>
                            <input type="text"/>
                            <img src={searchIcon} alt="."/>
                        </div>
                    </li>
                    <li>
                        <button>
                            <img src={logoutIcon} alt="."/>
                            Logout
                        </button>
                    </li>
                </ul>
            </NavBar>
            <FriendList>
                <ul>
                    <li>Pedro Muniz</li>
                    <li>Daniel Arruda</li>
                    <li>Pedro Muniz</li>
                    <li>Pedro Muniz</li>
                    <li>Pedro Muniz</li>
                    <li>Pedro Muniz</li>
                    <li>Pedro Muniz</li>
                    <li>Pedro Muniz</li>
                    <li>Pedro Muniz</li>
                    <li>Pedro Muniz</li>
                    <li>Pedro Muniz</li>
                    <li>Pedro Muniz</li>
                    <li>Pedro Muniz</li>
                    <li>Pedro Muniz</li>
                    <li>Pedro Muniz</li>
                    <li>Pedro Muniz</li>
                    <li>Pedro Muniz</li>
                    <li>Pedro Muniz</li>
                    <li>Pedro Muniz</li>
                    <li>Pedro Muniz</li>
                    <li>Pedro Muniz</li>
                    <li>Pedro Muniz</li>
                    <li>Pedro Muniz</li>
                    <li>Pedro Muniz</li>
                    <li>Pedro Muniz</li>
                    <li>Pedro Muniz</li>
                    <li>Pedro Muniz</li>
                    <li>Pedro Muniz</li>
                    <li>Pedro Muniz</li>
                    <li>Pedro Muniz</li>
                    <li>Pedro Muniz</li>
                    <li>Pedro Muniz</li>
                    <li>Pedro Muniz</li>
                    <li>Pedro Muniz</li>
                    <li>Pedro Muniz</li>
                    <li>Pedro Muniz</li>
                    <li>Pedro Muniz</li>
                    <li>Pedro Muniz</li>
                    <li>Pedro Muniz</li>
                    <li>Pedro Muniz</li>
                    <li>Pedro Muniz</li>
                    <li>Pedro Muniz</li>
                    <li>Pedro Muniz</li>
                    <li>Pedro Muniz</li>
                    <li>Pedro Muniz</li>
                    <li>Pedro Muniz</li>
                    <li>Pedro Muniz</li>
                    <li>Pedro Muniz</li>
                    <li>Pedro Muniz</li>
                    <li>Pedro Muniz</li>
                    <li>Pedro Muniz</li>
                    <li>Pedro Muniz</li>
                    <li>Pedro Muniz</li>
                    <li>Pedro Muniz</li>
                    <li>Pedro Muniz</li>
                    <li>Pedro Muniz</li>
                    <li>Pedro Muniz</li>
                    <li>Pedro Muniz</li>
                    <li>Pedro Muniz</li>
                    <li>Pedro Muniz</li>
                    <li>Pedro Muniz</li>
                    <li>Pedro Muniz</li>
                    <li>Pedro Muniz</li>
                    <li>Pedro Muniz</li>
                    <li>Pedro Muniz</li>
                    <li>Pedro Muniz</li>
                    <li>Pedro Muniz</li>
                    <li>Pedro Muniz</li>
                    <li>Pedro Muniz</li>
                    <li>Pedro Muniz</li>
                    <li>Pedro Muniz</li>
                    <li>Pedro Muniz</li>
                    <li>Pedro Muniz</li>
                    <li>Pedro Muniz</li>
                    <li>Pedro Muniz</li>
                    <li>Pedro Muniz</li>
                    <li>Pedro Muniz</li>
                    <li>Pedro Muniz</li>
                </ul>
            </FriendList>
            <Chat ref={chat}>
                <header onClick={() => changeChatExpansion(chat.current.style)}>
                    <strong>
                        Pedro Muniz
                    </strong>
                    <strong>
                        X
                    </strong>
                </header>
                <section>
                    { chatMessages.map(messageInfo => 
                        messageInfo.type == 1 ? <div><p className='user'>{messageInfo.message}</p></div> :
                            <div><p className='friendMsg'>{messageInfo.message}</p></div>) }
                </section>
                <input type="text" placeholder="Type a Message" onKeyPress={(e) => { if(e.which == 13) handleNewSendMessage(e.target.value)}}/>
            </Chat>
        </>
    );
}

export default Home;
