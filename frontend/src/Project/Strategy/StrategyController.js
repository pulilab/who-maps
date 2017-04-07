import CollapsibleSet from '../CollapsibleSet';

class StrategyController extends CollapsibleSet {

    constructor($scope, $element) {
        super($element, $scope, 'project');
        this.$onInit = this.onInit.bind(this);
        this.$onDestroy = this.defaultOnDestroy.bind(this);
        this.setAvailableOptions = this.setAvailableOptions.bind(this);
    }

    onInit() {
        this.defaultOnInit();
        this.watchers();
    }

    watchers() {
        const self = this;
        self.scope.$watch(() => {
            return this.project.platforms;
        }, (platform) => {
            self.setAvailableOptions(platform, self.structure.technology_platforms, 'name');
        }, true);
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
