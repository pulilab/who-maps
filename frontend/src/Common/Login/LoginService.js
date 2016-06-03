import SimpleApi from '../SimpleApi';
import Storage from '../Storage';

/* global Promise */

class LoginService extends SimpleApi {
    constructor() {
        super('api-token-auth/');
        this.storage = new Storage();
        this.processLoginJson = this.processLoginJson.bind(this);
    }

    login(data) {
        return this.post('', data)
        .then(answer => {
            return answer.json();
        })
        .then(json => {
            return this.processLoginJson(json);
        });
    }

    processLoginJson(json) {
        if (json && json.token) {
            this.storage.set('token', json.token);
            this.storage.set('user_profile_id', json.user_profile_id);
            return Promise.resolve(true);
        }
        return Promise.reject(json);
    }

    storeUser(user) {
        this.storage.set('user', user);
    }
}

export default LoginService;
