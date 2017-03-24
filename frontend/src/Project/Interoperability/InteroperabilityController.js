import CollapsibleSet from '../CollapsibleSet';

class InteroperabilityController extends CollapsibleSet {

    constructor($scope, $element) {
        super($element, 'project');
        this.scope = $scope;
        this.$onInit = this.onInit.bind(this);
    }

    onInit() {
        console.log(this);
        window.TEST = this.project;
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
