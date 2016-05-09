import AuthApi from '../AuthApi';

/* global Promise */

class NewProjectService extends AuthApi {
    constructor() {
        super('');
    }

    newProject(data) {
        let status = void 0;
        return this.post('projects/', data)
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

    updateProject(data, id) {
        let status = void 0;
        return this.put(`projects/${id}/`, data)
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
    countryDistrict(id) {
        return this.get('countries/' + id + '/districts');
    }
}

export default NewProjectService;
