import _ from 'lodash';
import 'whatwg-fetch';
// import 'es6-promise';

/* global Promise, API, DEV */

class AuthApi {

    constructor(module) {
        this.retrieveToken();
        this.EE = window.EE;
        this.apiUrl = API;
        this.updateOnNextRequest = false;

        if (module) {
            this.apiUrl += module + '/';
        }

        this.preGet = false;
        this.prePost = false;
        this.prePut = false;
        this.preDelete = false;
        this.EE.on('logout', this.invalidate, this);
    }

    invalidate() {
        this.token = void 0;
        this.updateOnNextRequest = true;
    }

    cleanDoubleDollar(items) {
        const deepSearch = (data) => {
            _.forEach(data, (value, key, collection) => {
                if (key && _.isString(key) && key.indexOf('$$') > -1) {
                    delete collection[key];
                }
                if (value instanceof Object || value instanceof Array) {
                    deepSearch(value);
                }
            });
        };
        deepSearch(items);
        return items;
    }

    get(endpoint) {
        if (this.preGet) {
            this.preGet();
        }
        this.retrieveToken();
        const request = this.generateRequest();
        request.method = 'GET';
        return fetch(this.apiUrl + endpoint, request)
            .then((response) => {
                if (response.status === 401) {
                    this.EE.emit('unauthorized');
                }
                return response.json();
            })
            .then((json) =>{
                return this.cleanDoubleDollar(json);
            });
    }

    getBlob(endpoint) {
        if (this.preGet) {
            this.preGet();
        }
        this.retrieveToken();
        const request = this.generateRequest();
        request.method = 'GET';
        return fetch(this.apiUrl + endpoint, request)
            .then((response) => {
                if (response.status === 401) {
                    this.EE.emit('unauthorized');
                }
                return response.blob();
            })
            .then(blob => {
                return blob;
            });
    }

    del(endpoint) {
        if (this.preDelete) {
            this.preDelete();
        }
        this.retrieveToken();
        const request = this.generateRequest();
        request.method = 'DELETE';
        return fetch(this.apiUrl + endpoint, request)
            .then((response) => {
                if (response.status === 401) {
                    this.EE.emit('unauthorized');
                }
                return response;
            });
    }

    post(endpoint, _data) {
        const data = this.cleanDoubleDollar(_data);
        if (this.prePost) {
            this.prePost();
        }
        this.retrieveToken();
        const request = this.generateRequest();
        request.method = 'POST';
        request.body = JSON.stringify(data);
        return fetch(this.apiUrl + endpoint, request)
            .then((response) => {
                return response;
            });
    }

    put(endpoint, _data) {
        const data = this.cleanDoubleDollar(_data);
        if (this.prePut) {
            this.prePut();
        }
        this.retrieveToken();
        const request = this.generateRequest();
        request.method = 'PUT';
        request.body = JSON.stringify(data);
        return fetch(this.apiUrl + endpoint, request)
            .then((response) => {
                return response;
            });
    }

    postFormData(endpoint, data) {
        this.retrieveToken();
        const request = this.generateRequest();
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

    retrieveToken(update) {
        if (update || !this.token) {
            this.token = window.sessionStorage.getItem('token');
        }
    }

    generateRequest() {
        return {
            headers: this.generateHeaders.bind(this)(),
            cache: 'default',
            mode: 'cors'
        };
    }

    generateHeaders() {
        if (this.updateOnNextRequest) {
            this.retrieveToken(true);
            this.updateOnNextRequest = false;
        }
        const headers = new Headers();
        headers.append('Authorization', 'Token ' + this.token);
        headers.append('content-type', 'application/json');
        return headers;
    }

}

export default AuthApi;
