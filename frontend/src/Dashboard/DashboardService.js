import { AuthApi } from '../Common/';

class DashboardService extends AuthApi {

    constructor(_projectId) {
        super('projects');
        this.projectId = _projectId;
    }

    getAxisData() {
        return this.get(this.projectId + '/toolkit/data/')
            .then(data => data);
    }

    getProjectData(projectId) {
        return this.get(projectId)
            .then(data => data);
    }

    snapShot(projectId) {
        return this.post(projectId + '/version/');
    }

    getToolkitVersions(projectId) {
        return this.get(projectId + '/toolkit/versions/')
            .then(data => {
                // console.log(data);
                return data;
            });
    }
}

export default DashboardService;
