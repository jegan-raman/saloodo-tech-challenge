import { SHIPMENT_RESET, SHIPMENT_LIST, ASSIGN_SHIPMENT, UPDATE_SHIPMENT, SHIPMENT_DASHBOARD } from 'Actions/types';
import Api from 'Api';
import { NotificationManager } from 'react-notifications';
import { SHIPMENT_END_POINT, ASSIGN_SHIPMENT_END_POINT, UPDATE_SHIPMENT_END_POINT, SHIPMENT_DASHBOARD_END_POINT } from 'Util';


const throwErrorNotification = (error) => {
    const errorMessage = (error &&  error.message) ? error.message : 'Something went wrong';
    NotificationManager.error(errorMessage, 'Error');
}

/**
* Redux Action To Get Dashbaord Reports
*/
export const GetDashboardReports = (query = {}, pagination= false) => (dispatch) => {
    // dispatch({ type: SHIPMENT_RESET });
    Api.get(SHIPMENT_DASHBOARD_END_POINT, query , pagination)
    .then((response) => {
        dispatch({ type: SHIPMENT_DASHBOARD, payload: response.data });
    })
    .catch(error => {
        throwErrorNotification(error);
    });
};

/**
* Redux Action To Get List of Shipements
*/
export const GetShipmentList = (query = {}, pagination= false) => (dispatch) => {
    dispatch({ type: SHIPMENT_RESET });
    Api.get(SHIPMENT_END_POINT, query , pagination)
    .then((response) => {
        dispatch({ type: SHIPMENT_LIST, payload: response.data });
    })
    .catch(error => {
        throwErrorNotification(error);
    });
};

/**
* Redux Action To Save assignee of Shipements
*/
export const AssignShipment = (formData, query) => (dispatch) => {
    // dispatch({ type: SHIPMENT_RESET });
    Api.post(ASSIGN_SHIPMENT_END_POINT, formData, query, false)
    .then((response) => {
        dispatch({ type: ASSIGN_SHIPMENT });
    })
    .catch(error => {
        throwErrorNotification(error);
    })
};

/**
* Redux Action To update status of Shipements
*/
export const UpdateShipment = (formData, query) => (dispatch) => {
    // dispatch({ type: SHIPMENT_RESET });
    Api.put(UPDATE_SHIPMENT_END_POINT, formData, query, false)
    .then((response) => {
        dispatch({ type: UPDATE_SHIPMENT });
    })
    .catch(error => {
        throwErrorNotification(error);
    })
};

