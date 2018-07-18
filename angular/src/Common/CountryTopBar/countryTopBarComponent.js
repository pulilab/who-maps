import _template from './countryTopBar.html';
import CountryTopBarController from './CountryTopBarController';

const topBarComponent = {
  controller: CountryTopBarController.countryTopBarControllerFactory(),
  template: _template,
  controllerAs: 'vm',
  name: 'countryTopBar',
  bindings: {
    viewMode: '<',
    showFullNavigation: '<'
  }
};

export default topBarComponent;
