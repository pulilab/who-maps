import CollapsibleSet from '../CollapsibleSet';

class TechnologyController extends CollapsibleSet {

    constructor($scope, $element) {
        super($element, 'project');
        this.scope = $scope;
        this.$onInit = this.onInit.bind(this);
    }

    onInit() {
        console.log(this);
        window.TEST = this.project;
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
