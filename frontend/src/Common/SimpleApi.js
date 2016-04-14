import _ from 'lodash';
import 'whatwg-fetch';
import 'es6-promise';

/* global Promise, API */

class SimpleApi {

    constructor(module) {
        this.apiUrl = API;
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

    generateHeaders() {
        const headers = new Headers();
        headers.append('content-type', 'application/json');
        return headers;
    }

}

export default SimpleApi;
