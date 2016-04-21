import { AuthApi } from '../Common/';

class MapsToolkitService extends AuthApi {

    constructor(_projectId) {
        super('/projects/');
        this.projectId = _projectId;
    }

    getProjectData() {
        return this.get(this.projectId + '/toolkit/data/')
        .then(data => {
            console.log(data);
            return data;
        });
    }

    saveAnswer(answer) {
        return this.post(this.projectId + '/toolkit/score/', answer)
        .then(data => {
            console.log(data);
        })
    }
}


export default MapsToolkitService;
