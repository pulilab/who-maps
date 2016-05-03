import AuthApi from '../AuthApi';

/* global Promise */

class NewProjectService extends AuthApi {
    constructor() {
        super('');
    }

    newProject(data) {
        console.log(data);
    }

    projectStructure() {
        return this.get('projects/structure/')
    }

    countryDistrict(id){
        return this.get('countries/' + id + '/districts');
    }
}

export default NewProjectService;
