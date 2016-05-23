import CountryViewModuleController from './CountryViewModuleController.js';
import _template from './CountryViewModule.html';
import './CountryView.scss';

console.debug('CLV ctrl, html and css loaded...');
console.debug('CLV component ready');

const clvComponent = {
    controller: CountryViewModuleController.countryControllerFactory(),
    template: _template,
    controllerAs: 'vm',
    name: 'countryView'
};

export default clvComponent;
