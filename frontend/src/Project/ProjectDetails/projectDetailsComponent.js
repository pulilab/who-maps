import _template from './ProjectDetails.html';
import ProjectDetailsController from './ProjectDetailsController';

const component = {
    template: _template,
    controller: ProjectDetailsController.projectDetailFactory(),
    controllerAs: 'vm',
    name: 'projectDetails',
    bindings: {
        form: '<',
        project: '<',
        structure: '<',
        team: '<',
        viewers: '<',
        users: '<',
        projectList: '<'
    }
};

export default component;
