import angular from 'angular';
import CountryViewModuleController from './CountryViewModuleController';
import sampleComponent from './SampleComponent/sampleComponent';

import _template from './countryViewModule.html';
import uiRoute from 'angular-ui-router';

const moduleName = 'countryViewModule';

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
    .component('sampleComponent', sampleComponent)
    .config(config);

export default moduleName;
