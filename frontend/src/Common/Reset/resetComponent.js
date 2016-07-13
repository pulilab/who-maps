import _template from './Reset.html';
import ResetController from './ResetController';


const resetComponent = {
    controller: ResetController.resetFactory(),
    template: _template,
    controllerAs: 'vm',
    name: 'reset'
};

export default resetComponent;
