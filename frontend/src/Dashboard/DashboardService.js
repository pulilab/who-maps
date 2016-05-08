import { AuthApi } from '../Common/';

class DashboardService extends AuthApi {

    constructor(_projectId) {
        super('projects');
        this.projectId = _projectId;
    }

    getAxisData() {
        return this.get(this.projectId + '/toolkit/data/')
            .then(data => {
                // console.debug(data);
                return data;
            });
    }

    getProjectData(projectId) {
        return this.get(projectId)
            .then(data => {
                // console.debug('PROJECT data:', data);
                return data;
            });
    }

    snapShot(projectId) {
        return this.post(projectId + '/version/');
    }

    getToolkitData(projectId) {
        return this.get(projectId + '/toolkit/data/').then(data => {
            // console.debug(data);
            return data;
        });
    }

    getToolkitVersions(projectId) {
        return this.get(projectId + '/toolkit/versions/')
            .then(data => {
                // console.debug('RAW toolkit versions:', data);
                return data;
            });
    }

    getCoverageVersions(projectId) {
        return this.get(projectId + '/coverage/versions/')
            .then(data => {
                // console.debug('RAW coverage versions:', data);
                return data;
            });
    }
}

export default DashboardService;
