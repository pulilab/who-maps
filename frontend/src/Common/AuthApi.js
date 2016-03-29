import _ from 'lodash';
import 'whatwg-fetch';
import 'es6-promise';

class AuthApi {

    constructor() {
        this.token = this.retrieveToken();
        this.baseUrl = '/api/';

        this.request = {
            headers: this.generateHeaders.bind(this)(),
            cache: 'default',
            mode: 'cors'
        };
    }

    get(endpoint) {
        const request = _.cloneDeep(this.request);
        request.method = 'GET';
        return fetch(this.baseUrl + endpoint, request)
            .then((response) => {
                return response.json();
            })
            .then((json) =>{
                return json;
            });
    }

    post(endpoint, data) {
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
        return fetch(this.baseUrl + endpoint, request)
            .then((response) => {
                return response;
            });
    }

    postSingle(endpoint, keyString, data) {
        const item = [{
            name: keyString,
            value: data
        }];
        return this.post(endpoint, item);
    }

    retrieveToken() {
        return window.sessionStorage.getItem('token');
    }

    generateHeaders() {
        const headers = new Headers();
        headers.append('HTTP_AUTHORIZATION', this.token);
        return headers;
    }

}

export default AuthApi;
