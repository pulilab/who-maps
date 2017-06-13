import StrategyController from './ImplementationOverviewController';
import _template from './ImplementationOverview.html';


const component = {
    template: _template,
    controller: StrategyController.factory(),
    controllerAs: 'vm',
    name: 'implementationOverview',
    bindings: {
        form: '<',
        project: '<',
        structure: '<'
    }
};

export default component;
