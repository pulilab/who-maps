import _template from './Interventions.html';
import InterventionsController from './InterventionsController';


const interventionsComponent = {
    controller: InterventionsController.interventionsFactory(),
    template: _template,
    controllerAs: 'vm',
    bindings: {
        tiles: '<',
        structure: '<',
        data: '<',
        service: '<'
    },
    name: 'interventions'
};

export default interventionsComponent;
