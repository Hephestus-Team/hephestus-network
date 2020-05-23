import styled from 'styled-components';

export const ChatStyle = styled.div`
    bottom: 0;
    right: 20vw;
    position: fixed;

    z-index: 1;

    font-size: 14px;

    background-color: #FFFFFF;
    border-bottom: none;
    border-radius: 10px 10px 0 0;
    width: 20vw;
    max-width: 20rem;
    height: 7vh;
    max-height: 25rem;

    display: flex;
    flex-direction: column;
    justify-content: space-between;

    transition: height 300ms ease;

    button {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;

        height: 8vh;
        max-height: 4.2rem;
        font-size: 16px;
        font-weight: bold;
        border-radius: 6px 6px 4px 4px;
        border: 0;
        padding: 0;

        background: #05ade0;
        color: #FEFEFF;
    }

    button strong {
        margin: 20px;
    }

    button svg {
      margin-right: 20px;
    }

    section {
        overflow: scroll;
        display: none;

        margin-bottom: auto;
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

export const MessageBallon = styled.div.attrs((props) => ({

  textAlign: props.className === 'userMsg' ? 'right' : 'left',
  margin: props.className === 'userMsg' ? '0 0 0 auto' : '0 auto 0 0',
  backgroundColor: props.className === 'userMsg' ? '#2979FF' : '#F3F3F3',
  color: props.className === 'userMsg' ? '#E3EDFF' : '#565656',

}))`
    margin: 20px 15px;

    p {
        margin: ${(props) => props.margin};
        padding: 10px;
        text-align: ${(props) => props.textAlign};

        max-width: 50%;
        border-radius: 5px;

        background-color: ${(props) => props.backgroundColor};
        color: ${(props) => props.color};

        box-shadow: 5px 5px 7px #888888;

        word-wrap: break-word;
    }
`;
