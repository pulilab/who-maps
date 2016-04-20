import _template from './ProjectComponent.html';
import ProjectComponentController from './ProjectComponentController';

const projectComponent = {
    controller: ProjectComponentController.projectComponentFactory(),
    template: _template,
    controllerAs: 'vm',
    name: 'projectcomp',
    bindings: {
        ngModel: '=',
        hasLink: '=',
        hasLogo: '='
    }
};

export default projectComponent;
