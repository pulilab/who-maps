import AuthApi  from '../Common/AuthApi';
import { StaticUtilities } from '../Utilities';

/* global Promise, URL */

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

    getGroups(projectId) {
        return this.get(`projects/${projectId}/groups/`)
            .then(answer => {
                return {
                    success: answer.status < 400,
                    data: answer
                };
            });
    }

    putGroups(projectId, team, viewers) {
        const ret = {
            team: team.map(el => el.id),
            viewers: viewers.map(el => el.id)
        };
        return this.put(`projects/${projectId}/groups/`, ret);
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

    deleteFile(fileId) {
        return this.del(`files/${fileId}/delete/`);
    }

    downloadFile(file) {
        return this.getBlob(`files/${file.id}/`)
            .then(data => {
                StaticUtilities.launchDownload(data, file.filename);
            });
    }

    autocompleteProjectName(name) {
        const data = {
            health_topic: false,
            location: false,
            organisation: false,
            project_name: true,
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
