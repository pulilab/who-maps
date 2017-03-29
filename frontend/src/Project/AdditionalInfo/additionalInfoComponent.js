import AdditionalInfoController from './AdditionalInfoController';
import _template from './AdditionalInfo.html';


const component = {
    template: _template,
    controller: AdditionalInfoController.additionalInfoControllerFactory(),
    controllerAs: 'vm',
    name: 'additionalInfo',
    bindings: {
        form: '<',
        project: '<',
        structure: '<'
    }
};

export default component;
