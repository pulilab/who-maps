import _ from 'lodash';
import NewProjectService from './NewProjectService';

class NewProjectController {

    constructor($scope) {
        this.ss = new NewProjectService();
        this.scope = $scope;

    }

    handleCustomError(newProjectForm, key) {
        newProjectForm[key].$setValidity('custom', true);
        newProjectForm[key].customError = [];

    }

    static newProjectFactory() {
        require('./NewProject.scss');
        function newProject($scope) {
            return new NewProjectController($scope);
        }
        newProject.$inject = ['$scope'];
        return newProject;
    }
}

export default NewProjectController;
