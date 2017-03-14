import _template from './subBar.html';
import SubBarController from './SubBarController';


const subBarComponent = {
    controller: SubBarController.subBarControllerFactory(),
    template: _template,
    controllerAs: 'vm',
    name: 'subBar',
    bindings: {
        viewMode: '<',
        showFullNavigation: '<'
    }
};

export default subBarComponent;
