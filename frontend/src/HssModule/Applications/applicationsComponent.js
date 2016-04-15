import _template from './Applications.html';
import ApplicationsController from './ApplicationsController';


const applicationsComponent = {
    controller: ApplicationsController.applicationsFactory(),
    template: _template,
    controllerAs: 'vm',
    bindings: {
        tiles: '<',
        structure: '<',
        data: '<',
        service: '<'
    },
    name: 'applications'

};

export default applicationsComponent;
