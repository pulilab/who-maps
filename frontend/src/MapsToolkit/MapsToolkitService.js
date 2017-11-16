
class MapsToolkitService {

    constructor(_projectId) {
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
        });
    }
}


export default MapsToolkitService;
