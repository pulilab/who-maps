import CollapsibleSet from '../CollapsibleSet';

class StrategyController extends CollapsibleSet {

    constructor($scope, $element) {
        super($element, $scope, 'project');
        this.$onInit = this.defaultOnInit.bind(this);
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
