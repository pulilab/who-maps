import CollapsibleSet from '../CollapsibleSet';

class TechnologyController extends CollapsibleSet {
  constructor ($scope, $element, $ngRedux) {
    super($element, $scope, 'project', [{ toWatch: 'customLicense', field: 'licenses' }], [], $ngRedux);
    this.$onInit = this.defaultOnInit.bind(this);
    this.$onDestroy = this.defaultOnDestroy.bind(this);
  }

  static technologyControllerFactory () {
    require('./Technology.scss');
    function technologyController ($scope, $element, $ngRedux) {
      return new TechnologyController($scope, $element, $ngRedux);
    }
    technologyController.$inject = ['$scope', '$element', '$ngRedux'];
    return technologyController;
  }
}

export default TechnologyController;
