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
        const data = {
            health_topic: false,
            location: false,
            organisation: true,
            project_name: false,
            query: name,
            technology_platform: false
        };
        return this.post('search/projects/', data)
            .then(results => {
                return results.json();
            });
    }

}



export default NewProjectService;
