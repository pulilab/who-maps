import CollapsibleSet from '../CollapsibleSet';

class TechnologyController extends CollapsibleSet {

    constructor($scope, $element) {
        super($element, $scope, 'project', [{ toWatch: 'customLicense', field: 'licenses' }]);
        this.$onInit = this.defaultOnInit.bind(this);
        this.$onDestroy = this.defaultOnDestroy.bind(this);
    }

    static technologyControllerFactory() {
        require('./Technology.scss');
        function technologyController($scope, $element) {
            return new TechnologyController($scope, $element);
        }
        technologyController.$inject = ['$scope', '$element'];
        return technologyController;
    }
}

export default TechnologyController;
