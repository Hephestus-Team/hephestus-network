import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from 'react-router-dom';

import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Home from './pages/Home';

import { isAuthenticated } from "./services/auth";

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      isAuthenticated() ? (
        <Component {...props} />
      ) : (
        <Redirect to='/' />
      )
    }
  />
);

function Routes() {

  return (
    <Router>
      <Switch>
        <Route path="/" exact>
          <SignIn />
        </Route>
        <Route path="/register">
          <SignUp />
        </Route>
        <PrivateRoute path="/home" component={() => <Home/>} />
        <Route path="*" component={() => <h1>Page not found</h1>} />
      </Switch>
    </Router>
  );
}

export default Routes;
