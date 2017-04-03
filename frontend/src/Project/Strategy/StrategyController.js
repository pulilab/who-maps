import CollapsibleSet from '../CollapsibleSet';

class StrategyController extends CollapsibleSet {

    constructor($scope, $element) {
        super($element, $scope, 'project');
        this.$onInit = this.onInit.bind(this);
        this.$onDestroy = this.defaultOnDestroy.bind(this);
        this.setPlatformAvailableOptions = this.setPlatformAvailableOptions.bind(this);
    }

    onInit() {
        this.defaultOnInit();
        this.watchers();
    }

    watchers() {
        const self = this;
        self.scope.$watch(() => {
            return this.project.platforms;
        }, self.setPlatformAvailableOptions, true);

    }

    setPlatformAvailableOptions(platforms) {
        const self = this;
        const used = platforms.map(platform => platform.name).filter(name => name);
        platforms.forEach(platform => {
            const availablePlatforms = self.structure.technology_platforms.filter(p => {
                return used.indexOf(p) === -1;
            });
            if (platform.name) {
                availablePlatforms.push(platform.name);
            }
            availablePlatforms.sort((a, b) => {
                return a.localeCompare(b);
            });
            platform.availablePlatforms = availablePlatforms;
        });
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
