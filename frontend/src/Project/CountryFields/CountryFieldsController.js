import CollapsibleSet from '../CollapsibleSet';
import * as ProjectModule from '../../store/modules/projects';

class CountryFieldsController extends CollapsibleSet {
  constructor ($scope, $element, $ngRedux) {
    super($element, $scope, 'project');
    this.$onInit = this.onInit.bind(this);
    this.$ngRedux = $ngRedux;
    this.$onDestroy = this.onDestroy.bind(this);
    this.mapState = this.mapState.bind(this);
  }

  onInit () {
    this.defaultOnInit();
    this.unsubscribe = this.$ngRedux.connect(this.mapState, ProjectModule)(this);
  }

  mapState (state) {
    const countryFields = ProjectModule.getProjectCountryFields(state)(!this.isPublished);
    return {
      countryFields
    };
  }

  onDestroy () {
    this.defaultOnDestroy();
    this.unsubscribe();
  }

  static factory () {
    require('./CountryFields.scss');
    function technologyController ($scope, $element, $ngRedux) {
      return new CountryFieldsController($scope, $element, $ngRedux);
    }
    technologyController.$inject = ['$scope', '$element', '$ngRedux'];
    return technologyController;
  }
}

export default CountryFieldsController;
