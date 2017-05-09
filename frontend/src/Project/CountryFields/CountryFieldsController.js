import CollapsibleSet from '../CollapsibleSet';

class CountryFieldsController extends CollapsibleSet {

    constructor($scope, $element) {
        super($element, $scope, 'project');
        this.$onInit = this.onInit.bind(this);
        this.$onDestroy = this.defaultOnDestroy.bind(this);
    }

    onInit() {
        this.defaultOnInit();
    }

    static factory() {
        require('./CountryFields.scss');
        function technologyController($scope, $element) {
            return new CountryFieldsController($scope, $element);
        }
        technologyController.$inject = ['$scope', '$element'];
        return technologyController;
    }
}

export default CountryFieldsController;
