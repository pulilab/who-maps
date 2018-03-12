import AssesmentModuleController from './AssesmentModuleController';
import _template from './Assesment.html';
import './Assesment.scss';

const assesmentComponent = {
    controller: AssesmentModuleController.factory(),
    template: _template,
    controllerAs: 'vm',
    name: 'assesment',
    bindings: {
        viewMode: '@'
    }
};

export default assesmentComponent;
