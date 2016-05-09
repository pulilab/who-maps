import AuthApi from '../AuthApi';

/* global Promise */

class NewProjectService extends AuthApi {
    constructor() {
        super('');
    }

    updateProfile(data) {
        let status = void 0;
        return this.post('userprofiles/', data)
            .then(answer => {
                status = answer.status;
                return answer.json();
            })
            .then(json => {
                return {
                    success: status < 400,
                    data: json
                };
            });
    }
}

export default NewProjectService;
