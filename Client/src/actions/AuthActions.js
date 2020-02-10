import { LOGIN_USER, LOGIN_USER_FAILURE, LOGIN_USER_SUCCESS, LOGOUT_USER } from 'Actions/types';
import Api from 'Api';
import { NotificationManager } from 'react-notifications';
import { Auth } from 'Util';


const throwErrorNotification = (error) => {
    const errorMessage = (error &&  error.message) ? error.message : 'Something went wrong';
    NotificationManager.error(errorMessage, 'Error');
}

/**
 * Redux Action To Sigin User
 */
export const signInWithEmailAndPassword = (user, history) => (dispatch) => {
    dispatch({ type: LOGIN_USER });
    Api.post('login', user).then((result) => {
        Auth.setUser(result.data.data);
        dispatch({ type: LOGIN_USER_SUCCESS, payload: Auth.getUser() });
        history.push('/');
        NotificationManager.success('User Loggedin Successfully!', 'Success');
        window.location.reload();
        
    })
    .catch((error) => {
        dispatch({ type: LOGIN_USER_FAILURE });
        throwErrorNotification(error);
    });
}

/**
 * Redux Action To Signout User
 */
export const signOutUser = () => (dispatch) => {
    dispatch({ type: LOGOUT_USER });
    Auth.destroyUser();
    NotificationManager.success('User Loggedout Successfully', 'Success');
    window.location.reload();
}
 
