import CollapsibleSet from '../CollapsibleSet';

class StrategyController extends CollapsibleSet {

    constructor($scope, $element) {
        super($element, 'project');
        this.scope = $scope;
        this.$onInit = this.onInit.bind(this);
    }

    onInit() {
        console.log(this);
        window.TEST = this.project;
    }

    static strategyControllerFactory() {
        require('./Strategy.scss');
        function strategyController($scope, $element) {
            return new StrategyController($scope, $element);
        }
        strategyController.$inject = ['$scope', '$element'];
        return strategyController;
    }
}

export default StrategyController;
