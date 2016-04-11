import _template from './ProjectScale.html';
import ProjectScaleController from './ProjectScaleController';

const projectScaleComponent = {
    controller: ProjectScaleController.projectScaleFactory(),
    template: _template,
    controllerAs: 'vm',
    bindings: {
        tiles: '<',
        data: '<'
    },
    name: 'projectscale'
};

export default projectScaleComponent;
