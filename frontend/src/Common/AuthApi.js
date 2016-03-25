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
