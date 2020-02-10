import AppConfig from 'Constants/AppConfig';
import decode from "jwt-decode";
import { forEach } from 'lodash';

export const Auth = {

    /**
    * Set User Details
    */
    setUser(userObject) {
        this.setToken(userObject['token']);
        delete userObject['token'];
        localStorage.setItem('loggedUser', JSON.stringify(userObject));
    },

    /**
    * Get User Details
    */
    getUser() {
        return window.localStorage.loggedUser ? JSON.parse(window.localStorage.loggedUser) : {};
    },

    /**
    * Get User Id
    */
    getUserId() {
        const loggedUser = this.getUser();
        return loggedUser.id;
    },

    /**
    * Delete User Details from localstorage
    */
    destroyUser() {
        window.localStorage.removeItem('loggedUser');
        this.destroyToken();
    },

    /**
    * Set Logged User Token
    */
    setToken(token) {
        localStorage.setItem('jwtToken', token);
    },

    /**
    * Get Logged User Token
    */
    getToken () {
        return (window.localStorage.jwtToken || '');
    },

    /**
    * Destroy User Token
    */
    destroyToken() {
        window.localStorage.removeItem('jwtToken');
    },

    /**
    * Check User Valid User Logged In
    */
    isLoggedIn () {
        // Checks if there is a saved token and it's still valid
        const token = this.getToken(); // Getting token from localstorage
        const isTokenExpired = this.isTokenExpired(token);
        // console.log('token', !!token);
        // console.log('isTokenExpired', isTokenExpired);
        return !!token && !isTokenExpired; // handwaiving here
    },

    /**
    * Check Token Expiry
    */
    isTokenExpired(token) {
        // console.log('isTokenExpired', token);
        try {
            token = token.replace(AppConfig.TOKEN_REPLACE_VALUE, ".");
            const decoded = decode(token);
            if (decoded.exp < (Date.now() / 1000)) {
                // Logic if token is expired.
                return true;
            } else {
                return false;
            }
        } catch (err) {
            // console.log("Token expired check failed! ", err);
            return true;
        }
    },

    /**
    * Check logged in user was Manager
    */
    isManager () {
        const loggedUser = this.getUser();
        return (loggedUser['role'] && loggedUser['role'] == 'MANAGER') ? true : false;
    },

    /**
    * Check logged in user was Biker
    */
    isBiker () {
        const loggedUser = this.getUser();
        return (loggedUser['role'] && loggedUser['role'] == 'BIKER') ? true : false;
    }
    
};
