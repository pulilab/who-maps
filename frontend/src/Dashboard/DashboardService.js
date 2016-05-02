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
        return this.get('')
            .then(data => {
                return data.filter(el => el.id === +projectId)[0];
            });
    }
}


export default DashboardService;
