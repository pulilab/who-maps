import AuthApi from '../AuthApi';

/* global Promise */

class NewProjectService extends AuthApi {
    constructor() {
        super('rest-auth');
    }

    newProject(data) {
    }
}

export default NewProjectService;
