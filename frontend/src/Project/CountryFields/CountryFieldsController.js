import CollapsibleSet from '../CollapsibleSet';

class CountryFieldsController extends CollapsibleSet {

    constructor($scope, $element) {
        super($element, $scope, 'project');
        this.$onInit = this.onInit.bind(this);
        this.$onDestroy = this.defaultOnDestroy.bind(this);
        this.countryFieldsChanged = this.countryFieldsChanged.bind(this);
    }

    onInit() {
        this.defaultOnInit();
        this.watchers();
    }

    watchers() {
        this.scope.$watchCollection(s => s.vm.countryFields, this.countryFieldsChanged);
    }

    countryFieldsChanged(fields) {
        if (fields && fields.length) {
            this.scope.$evalAsync(() => {
                this.values = new Array(fields.length);
                window.TEST = this.values;
            });
        }

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
