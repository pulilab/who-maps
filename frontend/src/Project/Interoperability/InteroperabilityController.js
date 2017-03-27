import CollapsibleSet from '../CollapsibleSet';

class InteroperabilityController extends CollapsibleSet {

    constructor($scope, $element) {
        super($element, $scope, 'project');
        this.$onInit = this.defaultOnInit.bind(this);
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
