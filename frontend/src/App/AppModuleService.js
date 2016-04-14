import { AuthApi } from '../Common/';

/* global Promise */

class AppModuleService extends AuthApi {
    constructor() {
        super();
    }

    getProjects() {
        return this.get('projects/');
    }

}

export default AppModuleService;
