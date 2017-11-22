import CollapsibleSet from '../CollapsibleSet';

class InteroperabilityController extends CollapsibleSet {

    constructor($scope, $element) {
        super($element, $scope, 'project',
          [{ toWatch: 'specifyOtherStandard', field: 'interoperability_standards' }],
          [{ toWatch: 'interoperability_links', check: 'selected', field: 'link' }]);
        this.$onInit = this.defaultOnInit.bind(this);
        this.$onDestroy = this.defaultOnDestroy.bind(this);
    }

    static interoperabilityControllerFactory() {
        require('./Interoperability.scss');
        function interoperabilityController($scope, $element) {
            return new InteroperabilityController($scope, $element);
        }
        interoperabilityController.$inject = ['$scope', '$element'];
        return interoperabilityController;
    }
}

export default InteroperabilityController;
