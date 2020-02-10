import { USER_RESET, USER_LIST } from 'Actions/types';
import Api from 'Api';
import { NotificationManager } from 'react-notifications';
import { USER_END_POINT } from 'Util';


const throwErrorNotification = (error) => {
    const errorMessage = (error &&  error.message) ? error.message : 'Something went wrong';
    NotificationManager.error(errorMessage, 'Error');
}

/**
* Redux Action To Get List of Users
*/
export const GetUserList = (query = {}, pagination= false) => (dispatch) => {
    dispatch({ type: USER_RESET });
    Api.get(USER_END_POINT, query , pagination)
    .then((response) => {
        dispatch({ type: USER_LIST, payload: response.data });
    })
    .catch(error => {
        throwErrorNotification(error);
    });
};