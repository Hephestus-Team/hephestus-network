import React from 'react';

import Routes from './routes';

import './styles/fonts.css';
import { GlobalStyle, AppContainer } from './styles/global';

const App = () => {
  return (
    <>
      <GlobalStyle />
      <AppContainer>
        <Routes />
      </AppContainer>
    </>
  );
}

export default App;
