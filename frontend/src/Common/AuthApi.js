import _ from 'lodash';
import 'whatwg-fetch';
import 'es6-promise';

/* global Promise */

class AuthApi {

    constructor(module) {
        this.token = this.retrieveToken();

        this.apiUrl = '/api/';

        if (module) {
            this.apiUrl += module + '/';
        }

        this.request = {
            headers: this.generateHeaders.bind(this)(),
            cache: 'default',
            mode: 'cors'
        };
    }

    get(endpoint) {
        const request = _.cloneDeep(this.request);
        request.method = 'GET';
        return fetch(this.apiUrl + endpoint, request)
            .then((response) => {
                return response.json();
            })
            .then((json) =>{
                return json;
            });
    }

    post(endpoint, data) {
        const request = _.cloneDeep(this.request);
        request.method = 'POST';
        request.body = JSON.stringify(data);
        return fetch(this.apiUrl + endpoint, request)
            .then((response) => {
                return response;
            });
    }

    postFormData(endpoint, data) {
        const request = _.cloneDeep(this.request);
        const body = new FormData();
        let performRequest = true;
        _.forEach(data, item => {
            if (!item.hasOwnProperty('name')) {
                console.warn('AuthApi: name property missing, record skipped ');
                performRequest = false;
                return;
            }
            if (!item.hasOwnProperty('value')) {
                console.warn('AuthApi: value property missing, record skipped ');
                performRequest = false;
                return;
            }
            body.append(item.name, item.value);
        });

        if (!performRequest) {
            return Promise.reject('Empty data to post');
        }

        request.method = 'POST';
        request.body = body;
        return fetch(this.apiUrl + endpoint, request)
            .then((response) => {
                return response;
            });
    }

    postSingleFormData(endpoint, name, value) {
        const item = [{ name, value }];
        return this.postFormData(endpoint, item);
    }

    objectConverter(dataObject) {
        const data = [];
        _.forEach(dataObject, (value, name) => {
            data.push({ name, value });
        });
        return data;
    }

    retrieveToken() {
        return window.sessionStorage.getItem('token');
    }

    generateHeaders() {
        const headers = new Headers();
        headers.append('Authorization', 'Token ' + this.token);
        headers.append('content-type', 'application/json');
        return headers;
    }

}

export default AuthApi;
