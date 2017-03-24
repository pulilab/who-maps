import CollapsibleSet from '../CollapsibleSet';

class AdditionalInfoController extends CollapsibleSet {

    constructor($scope, $element) {
        super($element, 'project');
        this.scope = $scope;
        this.$onInit = this.onInit.bind(this);
    }

    onInit() {
        console.log(this);
        window.TEST = this.project;
    }

    static additionalInfoControllerFactory() {
        require('./AdditionalInfo.scss');
        function additionalInfoController($scope, $element) {
            return new AdditionalInfoController($scope, $element);
        }
        additionalInfoController.$inject = ['$scope', '$element'];
        return additionalInfoController;
    }
}

export default AdditionalInfoController;
