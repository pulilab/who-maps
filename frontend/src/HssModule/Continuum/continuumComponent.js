import _template from './Continuum.html';
import ContinuumController from './ContinuumController';


const continuumComponent = {
    controller: ContinuumController.continuumFactory(),
    template: _template,
    controllerAs: 'vm',
    bindings: {
        tiles: '<',
        hss: '<'
    },
    name: 'continuum'
};

export default continuumComponent;
