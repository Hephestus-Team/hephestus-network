import styled, { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`

    *{
        margin: 0;
        padding: 0;
        outline: 0;
        box-sizing: border-box;
    }

    body{
        background: #E5E6F0;
        -webkit-font-smoothing: antialiased;
    }

    body, input, button{
        font-family: Roboto, Arial, sans-serif;
    }
`;

export const AppContainer = styled.div`
    max-width: 1200px;
    margin: 0 auto;
    padding: 60px 30px;

    display: flex;
    justify-content: center;
    align-items: center;
`;
