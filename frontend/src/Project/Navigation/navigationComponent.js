import _template from './Navigation.html';
import NavigationController from './NavigationController';

const component = {
    template: _template,
    controller: NavigationController.navigationFactory(),
    controllerAs: 'vm',
    name: 'navigation',
    bindings: {
        counter: '='
    }
};

export default component;
