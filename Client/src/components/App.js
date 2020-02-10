import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect, Route, Switch, BrowserRouter } from 'react-router-dom';
import ShipmentList from './ShipmentList';
import Signin from './Signin';
import { Auth } from 'Util';
import { NotificationContainer } from 'react-notifications';
import './App.css';

import 'react-notifications/lib/notifications.css';

/**
 * ProtectedRoute Only Allowed for Logged in User
 */
const ProtectedRoute = ({ component: Component, ...rest, authUser }) => {
    const isValidUserLoggedIn = Auth.isLoggedIn();
    return (
       <Route
          {...rest}
          render={props =>
             isValidUserLoggedIn
                ? <Component {...props} />
                : <Redirect
                   to={{
                      pathname: '/signin'
                   }}
                />}
       />
    )
}
 
const PublicRoute = ({ auth, ...props }) => {
    const isValidUserLoggedIn = Auth.isLoggedIn();
    return isValidUserLoggedIn
        ? (<Redirect to='/' />)
        : (<Route {...props} />)
};


class App extends Component {
    render () {
        const { location, match, user } = this.props;
        return (
            <div>
                <NotificationContainer />
                <BrowserRouter>
                    <Switch>
                        <PublicRoute path="/signin" exact component={Signin} />
                        <ProtectedRoute path="/" exact component={ShipmentList} />
                    </Switch>
                </BrowserRouter>
            </div>
        );
    }
}

// map state to props
const mapStateToProps = ({ authUser }) => {
    const { user } = authUser;
    return { user };
};
 
export default connect(mapStateToProps)(App);