import InteroperabilityController from './InteroperabilityController';
import _template from './Interoperability.html';


const component = {
    template: _template,
    controller: InteroperabilityController.interoperabilityControllerFactory(),
    controllerAs: 'vm',
    name: 'interoperability',
    bindings: {
        projects: '<',
        structure: '<'
    }
};

export default component;
