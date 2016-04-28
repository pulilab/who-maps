import { AuthApi } from '../Common/';

class DashboardService extends AuthApi {

    constructor(_projectId) {
        super('projects');
        this.projectId = _projectId;
    }

    getProjectData() {
        return this.get(this.projectId + '/toolkit/data/')
        .then(data => {
            return data;
        });
    }
}


export default DashboardService;
