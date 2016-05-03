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

    getProjectData() {
        return this.get('')
            .then(data => data);
    }
}


export default DashboardService;
