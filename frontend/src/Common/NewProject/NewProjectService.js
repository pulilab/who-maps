import AuthApi from '../AuthApi';

/* global Promise */

class NewProjectService extends AuthApi {
    constructor() {
        super('');
    }

    newProject(data) {
        console.log(data);
        this.post('projects/', data)
            .then(response => {
                console.log(response);
                this.EE.emit('refreshProjects');
            });
    }

    projectStructure() {
        return this.get('projects/structure/');
    }

    countryDistrict(id) {
        return this.get('countries/' + id + '/districts');
    }
}

export default NewProjectService;
