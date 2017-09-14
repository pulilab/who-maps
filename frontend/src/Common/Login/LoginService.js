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
          })
          .catch(error => {
              if (!error.non_field_errors) {
                  error = {
                      non_field_errors: ['Security error']
                  };
              }
              return this.processLoginJson(error);
          });
    }

    processLoginJson(json) {
        if (json && json.token) {
            this.storage.set('token', json.token);
            this.storage.set('user_profile_id', json.user_profile_id);
            this.storage.set('is_superuser', json.is_superuser);
            return Promise.resolve(true);
        }
        return Promise.reject(json);
    }

    storeUser(user) {
        this.storage.set('user', user);
    }
}

export default LoginService;
