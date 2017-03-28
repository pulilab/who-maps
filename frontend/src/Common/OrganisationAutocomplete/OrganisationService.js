import AuthApi from '../AuthApi';

/* global Promise */

class NewProjectService extends AuthApi {
    constructor() {
        super('');
    }

    autocompleteOrganization(name) {
        return this.get(`organisations/?name=${name}`);
    }

    addOrganization(name) {
        const data = { name };
        return this.post('organisations/', data)
            .then(response => {
                return response.json();
            });
    }

}


export default NewProjectService;
