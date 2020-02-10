import AppConfig from 'Constants/AppConfig';
import { forEach, isObject } from 'lodash';
import { Auth } from 'Util';
import http from './axios';

const Api = {
    
    /**
    * GET Method
    */
    get(path, params = {}, pagination = false) {
        if (pagination) {
            if (!params['size']) {
                params.size = AppConfig.tables.queryLimit;
            }
        }
        return http.get(`${path}/`, { params });
    },

    /**
    * PUT Method
    */
    put(path, body = {}, params = {}, isFormData = false) {
        let headers = {};
        let requestObj = body;
        return http.put(`${path}/`, requestObj, { params }, { headers });
    },

    /**
    * POST Method
    */
    post(path, body = {}, params = {}, isFormData = false) {
        let headers = {};
        let requestObj = body;
        return http.post(`${path}/`, requestObj, { params }, { headers });
    },

    /**
    * DELETE Method
    */
    delete(path, params = {}) {
        return http.delete(`${path}/`, { params });
    }
    
}

export default Api