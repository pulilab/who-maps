import CollapsibleSet from '../CollapsibleSet';

class AdditionalInfoController extends CollapsibleSet {

    constructor($scope, $element) {
        super($element, $scope, 'project');
        this.$onInit = this.defaultOnInit.bind(this);
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
