import angular from 'angular';
import CountryViewModuleController from './CountryViewModuleController';

import _template from './CountryViewModule.html';
import './CountryView.scss';
import uiRoute from 'angular-ui-router';

const moduleName = 'country';

function config($stateProvider) {
    $stateProvider
        .state(moduleName,
        {
            url: '/countryView',
            parent: 'app',
            views: {
                main: {
                    template: _template,
                    controller: moduleName + '.' + moduleName + 'Controller',
                    controllerAs: 'vm'
                }
            }
        });
}

config.$inject = ['$stateProvider'];

angular.module(moduleName, [uiRoute])
    .controller(moduleName + '.' + moduleName + 'Controller', CountryViewModuleController)
    .config(config);

export default moduleName;
