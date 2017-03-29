import TechnologyController from './TechnologyController';
import _template from './Technology.html';


const technology = {
    template: _template,
    controller: TechnologyController.technologyControllerFactory(),
    controllerAs: 'vm',
    name: 'technology',
    bindings: {
        form: '<',
        project: '<',
        structure: '<'
    }
};

export default technology;
