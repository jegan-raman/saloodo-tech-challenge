// redux action
import axios from 'axios';
import AppConfig from 'Constants/AppConfig';
import { forEach, isObject } from 'lodash';
import { NotificationManager } from 'react-notifications';
import { Auth } from 'Util';

let apiCount = 0;
let sessionExpired = false;

const axiosInstance = axios.create({
    baseURL: AppConfig.API_URL
});


// Add a request interceptor
axiosInstance.interceptors.request.use((config) => {
    // Do something before request is sent
    // Set Authorization Token for the requests
    const authToken = Auth.getToken();
    if (authToken) {
        config.headers['Authorization'] = 'Bearer ' + authToken;
    }

    // console.log('request interceptor');
    setLoader(true);
    return config;
}, (error) => {
    // Do something with request error
    // console.log('request interceptor error');
    return errorResponseHandler(error);
});


// Add a response interceptor
axiosInstance.interceptors.response.use((response) => {
    // Do something with response data
    // console.log('response interceptor');
    setLoader(false);
    return response;
}, (error) => {
    // Do something with response error
    console.log('response interceptor error');
    return errorResponseHandler(error);
});


const errorResponseHandler = (err) => {
    setLoader(false);
    let errorMessage = err.message;
    if (err.response) {
        errorMessage = err.response.data.error;
        if (!errorMessage){
            errorMessage = 'Error while getting the data';
        }
        if (err.response.status == 401 && !sessionExpired) {
            sessionExpired = true;
            document.body.classList.add('sessionExpired');
            Auth.destroyUser();
            setLoader(true);
            NotificationManager.info('Your session has expired!', 'Information');
            setTimeout(() => {
                location.reload(true);
            }, 2000); 
        }
    }
    return Promise.reject({ message: errorMessage });
}

const setLoader = (isLoading) => {
    if (isLoading) {
        apiCount++;
    } else {
        apiCount--;
    }
    if (apiCount == 1) {
        document.body.classList.add('loading-indicator');
    } else if (apiCount == 0) {
        document.body.classList.remove('loading-indicator');
    }
}

export default axiosInstance;