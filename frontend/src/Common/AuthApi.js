import _ from 'lodash';
import fetch from 'whatwg-fetch';

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
        _.forEach(data, item => {
            if (!item.hasOwnProperty('key')) {
                console.warn('AuthApi: key property missing, record skipped ');
                return;
            }
            if (!item.hasOwnProperty('value')) {
                console.warn('AuthApi: value property missing, record skipped ');
                return;
            }
            body.append(item.key, item.value);
        });
        request.method = 'POST';
        request.body = body;
        return fetch(this.baseUrl + endpoint, request)
            .then((response) => {
                return response;
            });
    }

    retrieveToken() {
        return window.sessionStorage.getItem('token');
    }

    generateHeaders() {
        const headers = new Headers();
        headers.append('Authorization', this.token);
        return headers;
    }

}

export default AuthApi;
