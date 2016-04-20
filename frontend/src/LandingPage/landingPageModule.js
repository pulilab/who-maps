import angular from 'angular';
import LandingPageModuleController from './LandingPageModuleController';

import _template from './LandingPageModule.html';
import uiRoute from 'angular-ui-router';
import './landingPage.scss';

const moduleName = 'landing';

function config($stateProvider) {
    $stateProvider
        .state(moduleName,
        {
            url: '/landing',
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
    .controller(moduleName + '.' + moduleName + 'Controller', LandingPageModuleController)
    .config(config);

export default moduleName;
