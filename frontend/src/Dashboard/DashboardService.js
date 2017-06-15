import { AuthApi } from '../Common/';

class DashboardService extends AuthApi {

    constructor(_projectId) {
        super('projects');
        this.projectId = _projectId;
    }
    getProjectData(projectId) {
        return this.get(projectId)
            .then(data => {
                // console.debug('PROJECT data:', data);
                return data;
            });
    }

    snapShot(projectId) {
        return this.post(projectId + '/version/').then(data => {
            return data.json();
        });
    }

    getToolkitData(projectId) {
        return this.get(projectId + '/toolkit/data/').then(data => {
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
