import AuthApi from '../AuthApi';

/* global Promise */

class NewProjectService extends AuthApi {
    constructor(_upload) {
        super('');
        this.upload = _upload;
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

    uploadFile(file, filetype, projectId) {
        this.retrieveToken(true);
        const _data = {};
        _data[filetype] = file;
        const Authorization = 'Token ' + this.token;
        return this.upload.upload({
            url: `api/projects/${projectId}/files/`,
            headers: { Authorization },
            data: _data
        });
    }

    countryDistrict(id) {
        return this.get('countries/' + id + '/districts');
    }
}

export default NewProjectService;
