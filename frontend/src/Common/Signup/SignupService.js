import SimpleApi from '../SimpleApi';
import Storage from '../Storage';

/* global Promise */

class SignupService extends SimpleApi {
    constructor() {
        super('rest-auth');
        this.storage = new Storage();
    }

    signup(data) {
        let status = void 0;
        return this.post('registration/', data)
        .then(answer => {
            status = answer.status;
            return answer.json();
        })
        .then(json => {
            return {
                success: status < 400,
                data: json
            };
        })
        .catch(error => {
            console.warn('Error in signup: ', error);
        });
    }
}

export default SignupService;
