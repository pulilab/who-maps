import _template from './ProjectComponent.html';
import ProjectComponentController from './ProjectComponentController';

const projectComponent = {
    controller: ProjectComponentController.projectComponentFactory(),
    template: _template,
    controllerAs: 'vm',
    name: 'projectComponent',
    bindings: {
        project: '<',
        showDetails: '<',
        showVersion: '<'
    }
};

export default projectComponent;
