import CountryViewModuleController from './CountryViewModuleController.js';
import _template from './CountryViewModule.html';
import './CountryView.scss';

const clvComponent = {
    controller: CountryViewModuleController.countryControllerFactory(),
    template: _template,
    controllerAs: 'vm',
    name: 'countryView'
};

export default clvComponent;
