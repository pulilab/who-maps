import CollapsibleSet from '../CollapsibleSet';

class InteroperabilityController extends CollapsibleSet {
  constructor ($scope, $element, $ngRedux) {
    super($element, $scope, 'project',
      [{ toWatch: 'specifyOtherStandard', field: 'interoperability_standards' }],
      [{ toWatch: 'interoperability_links', check: 'selected', field: 'link' }],
      $ngRedux
    );
    this.$onInit = this.defaultOnInit.bind(this);
    this.$onDestroy = this.defaultOnDestroy.bind(this);
  }

  static interoperabilityControllerFactory () {
    require('./Interoperability.scss');
    function interoperabilityController ($scope, $element, $ngRedux) {
      return new InteroperabilityController($scope, $element, $ngRedux);
    }
    interoperabilityController.$inject = ['$scope', '$element', '$ngRedux'];
    return interoperabilityController;
  }
}

export default InteroperabilityController;
