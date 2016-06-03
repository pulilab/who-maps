import SimpleApi from '../SimpleApi';

/* global Promise */

class LoginService extends SimpleApi {
    constructor() {
        super('rest-auth/registration');
    }

    activateEmail(key) {
        const data = {
            key
        };
        let status = void 0;
        return this.post('verify-email/', data)
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
                console.warn('Error in email confirmation: ', error);
            });
    }
}

export default LoginService;
