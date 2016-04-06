import _template from './Constraints.html';
import ConstraintsController from './ConstraintsController';


const constraintsComponent = {
    controller: ConstraintsController.constraintsFactory(),
    template: _template,
    controllerAs: 'vm',
    name: 'constraints',
    bindings: {
        resizeCallback: '='
    }
};

export default constraintsComponent;
