import _template from './topBar.html';
import TopBarController from './TopBarController';


const topBarComponent = {
    controller: TopBarController.topBarControllerFactory(),
    template: _template,
    controllerAs: 'vm',
    name: 'topBar',
    bindings: {
        viewMode: '<',
        showFullNavigation: '<'
    }
};

export default topBarComponent;
