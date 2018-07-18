
class CountryPartnersController {
  constructor ($scope, $state, $ngRedux) {
    this.scope = $scope;
    this.state = $state;
    this.$ngRedux = $ngRedux;
    this.$onInit = this.onInit.bind(this);
    this.$onDestroy = this.onDestroy.bind(this);
  }

  onInit () {
  }

  onDestroy () {
  }

  computeLogoStyle (logo) {
    return { 'background-image': `url(${logo})` };
  }

  static countryPartnersFactory () {
    require('./countryPartners.scss');
    function countryPartners ($scope, $state, $ngRedux) {
      return new CountryPartnersController($scope, $state, $ngRedux);
    }

    countryPartners.$inject = ['$scope', '$state', '$ngRedux'];

    return countryPartners;
  }
}

export default CountryPartnersController;
