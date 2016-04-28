import { AuthApi } from '../Common/';

class MapsToolkitService extends AuthApi {

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

    saveAnswer(answer) {
        return this.post(this.projectId + '/toolkit/score/', answer)
        .then(data => {
            return data.json();
        })
        .then(json => {
            console.log(json);
        });
    }
}


export default MapsToolkitService;
