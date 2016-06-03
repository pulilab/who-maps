import AuthApi from '../AuthApi';

/* global Promise */

class NewProjectService extends AuthApi {
    constructor() {
        super('');
    }

    updateProfile(data) {
        let status = void 0;
        return this.put(`userprofiles/${data.id}/`, data)
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
    createProfile(data) {
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
    autocompleteOrganization(name) {
        return this.get(`organisations/?name=${name}`);
    }

    addOrganization(name) {
        const data = { name };
        return this.post('organisations/', data);
    }

}


export default NewProjectService;
