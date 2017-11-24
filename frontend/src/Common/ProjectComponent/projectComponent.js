import _template from './ProjectComponent.html';
import ProjectComponentController from './ProjectComponentController';

const projectComponent = {
    controller: ProjectComponentController.projectComponentFactory(),
    template: _template,
    controllerAs: 'vm',
    name: 'projectComponent',
    bindings: {
        ngModel: '<',
        showDetails: '<',
        member: '<',
        viewer: '<',
        currentProject: '<'
    }
};

export default projectComponent;
