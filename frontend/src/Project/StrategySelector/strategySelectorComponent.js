import AddNewContentController from './StrategySelectorController';
import _template from './StrategySelector.html';


const component = {
    template: _template,
    controller: AddNewContentController.factory(),
    controllerAs: 'vm',
    name: 'strategySelector',
    bindings: {
        availableStrategies: '<',
        strategies: '=',
        platformName: '<',
        modalOpen: '=?'
    }
};

export default component;
