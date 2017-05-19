import _ from 'lodash';
import 'whatwg-fetch';
import Storage from './Storage';
// import 'es6-promise';

/* global Promise, API, DEV */

class AuthApi {

    constructor(module) {
        this.EE = window.EE;
        this.storage = new Storage();
        this.apiUrl = API;

        if (module) {
            this.apiUrl += module + '/';
        }

        this.preGet = false;
        this.prePost = false;
        this.prePut = false;
        this.preDelete = false;
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
        const request = this.generateRequest();
        request.method = 'GET';
        return fetch(this.apiUrl + endpoint, request)
          .then(this.responseProcessing.bind(this))
          .then(response => response.json())
          .then((json) =>{
              return this.cleanDoubleDollar(json);
          });
    }

    responseProcessing(response) {
        return response.ok ? response : response.json().then(Promise.reject.bind(Promise));
    }

    getBlob(endpoint) {
        if (this.preGet) {
            this.preGet();
        }
        const request = this.generateRequest();
        request.method = 'GET';
        return fetch(this.apiUrl + endpoint, request)
          .then(this.responseProcessing.bind(this))
          .then(response => response.blob())
          .then(blob => {
              return blob;
          });
    }

    del(endpoint) {
        if (this.preDelete) {
            this.preDelete();
        }
        const request = this.generateRequest();
        request.method = 'DELETE';
        return fetch(this.apiUrl + endpoint, request)
          .then(this.responseProcessing.bind(this));
    }

    post(endpoint, _data) {
        const data = this.cleanDoubleDollar(_data);
        if (this.prePost) {
            this.prePost();
        }
        const request = this.generateRequest();
        request.method = 'POST';
        request.body = JSON.stringify(data);
        return fetch(this.apiUrl + endpoint, request)
          .then(this.responseProcessing.bind(this));
    }

    put(endpoint, _data) {
        const data = this.cleanDoubleDollar(_data);
        if (this.prePut) {
            this.prePut();
        }
        const request = this.generateRequest();
        request.method = 'PUT';
        request.body = JSON.stringify(data);
        return fetch(this.apiUrl + endpoint, request)
          .then(this.responseProcessing.bind(this));
    }

    patch(endpoint, _data) {
        const data = this.cleanDoubleDollar(_data);
        const request = this.generateRequest();
        request.method = 'PATCH';
        request.body = JSON.stringify(data);
        return fetch(this.apiUrl + endpoint, request)
          .then(this.responseProcessing.bind(this));
    }

    postFormData(endpoint, data) {
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
          .then(this.responseProcessing.bind(this));
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
        return this.storage.get('token');
    }

    generateRequest() {
        return {
            headers: this.generateHeaders.bind(this)(),
            cache: 'default',
            mode: 'cors'
        };
    }

    generateHeaders() {
        const token = this.retrieveToken();
        const headers = new Headers();
        if (token) {
            headers.append('Authorization', 'Token ' + token);
        }
        headers.append('content-type', 'application/json');
        return headers;
    }

}

export default AuthApi;
