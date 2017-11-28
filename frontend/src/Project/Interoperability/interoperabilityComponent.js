import InteroperabilityController from './InteroperabilityController';
import _template from './Interoperability.html';
import _readOnlyTemplate from './ReadOnlyInteroperability.html';


const component = {
    template: _template,
    controller: InteroperabilityController.interoperabilityControllerFactory(),
    controllerAs: 'vm',
    name: 'interoperability',
    bindings: {
        form: '<',
        project: '<',
        structure: '<',
        activateValidation: '<'
    }
};

export default component;
export const readOnlyInteroperability = { ...component, name: 'readOnlyInteroperability', template: _readOnlyTemplate };
