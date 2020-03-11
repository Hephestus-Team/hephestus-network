import React, { useRef } from 'react';
import { Chat, NavBar, FriendList } from './styles';

import searchIcon from '../../assets/icons/searchIcon.svg';
import logoutIcon from '../../assets/icons/logoutIcon.svg';

const Home = () => {

    const chat = useRef(null);

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

    return (
        <>
            <NavBar>
                <ul>
                    <li>
                        <button>
                            <img src={logoutIcon} alt="."/>
                            Logout
                        </button>
                    </li>
                
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
                    <div>
                        <p className='friendMsg'>Olá</p>
                    </div>
                    <div>
                        <p className='user'>Olá arawr raw wr aw a awra asrasrae ad asfsetatea</p>
                    </div>
                    <div>
                        <p className='friendMsg'>Olá</p>
                    </div>
                    <div>
                        <p className='user'>Olá</p>
                    </div>
                    <div>
                        <p className='friendMsg'>Olá</p>
                    </div>
                    <div>
                        <p className='user'>Olá</p>
                    </div>
                    <div>
                        <p className='friendMsg'>Olá</p>
                    </div>
                    <div>
                        <p className='user'>Olá</p>
                    </div>
                    <div>
                        <p className='friendMsg'>Olá</p>
                    </div>
                    <div>
                        <p className='user'>Olá</p>
                    </div>
                    <div>
                        <p className='friendMsg'>Olá</p>
                    </div>
                    <div>
                        <p className='user'>Olá</p>
                    </div>
                    <div>
                        <p className='friendMsg'>Olá</p>
                    </div>
                    <div>
                        <p className='user'>Olá</p>
                    </div>
                </section>
                <input type="text" placeholder="Type a Message"/>
            </Chat>
        </>
    );
}

export default Home;
