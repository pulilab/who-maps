import StrategyController from './StrategyController';
import _template from './Strategy.html';


const component = {
    template: _template,
    controller: StrategyController.strategyControllerFactory(),
    controllerAs: 'vm',
    name: 'strategy',
    bindings: {
        project: '<',
        structure: '<'
    }
};

export default component;
