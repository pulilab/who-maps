import StrategyController from './StrategyController';
import _template from './Strategy.html';


const component = {
    template: _template,
    controller: StrategyController.strategyControllerFactory(),
    controllerAs: 'vm',
    name: 'strategy',
    bindings: {
        form: '<',
        project: '<',
        structure: '<'
    }
};

export default component;
