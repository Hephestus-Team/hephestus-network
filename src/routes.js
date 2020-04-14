/* eslint-disable import/named */
/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';

import { Provider, useStore } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Home from './pages/Home';
import Profile from './pages/Profile';
import ProfileSearch from './pages/ProfileSearch';
import Config from './pages/Config';

import { store, persistor } from './store';
import { PersistProvider } from './persistContext';

const PrivateRoute = ({ component: Component, ...rest }) => {
  const newStore = useStore();

  return (
    <Route
      {...rest}
      render={(props) => (newStore.getState().user.token ? (
        <Component {...props} />
      ) : (
        <SignIn />
      ))}
    />
  );
};

const Routes = () => (
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <PersistProvider value={persistor}>
        <Router>
          <Switch>
            <PrivateRoute path="/" exact component={() => <Home />} />
            <Route path="/signup">
              <SignUp />
            </Route>
            <PrivateRoute path="/profile/:uniqid" component={() => <Profile />} />
            <PrivateRoute path="/profileSearch/:name" component={() => <ProfileSearch />} />
            <PrivateRoute path="/config" component={() => <Config />} />
            <Route path="*" component={() => <h1>Page not found</h1>} />
          </Switch>
        </Router>
      </PersistProvider>
    </PersistGate>
  </Provider>
);

export default Routes;
