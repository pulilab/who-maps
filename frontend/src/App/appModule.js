import angular from 'angular';
import AppController from './AppModuleController';

import appTemplate from './app.html';
import uiRoute from 'angular-ui-router';

import hssPrototype from '../HssPrototype/';

const moduleName = 'app';

function config($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state(moduleName,
        {
            url: '/app',
            template: appTemplate,
            controller: moduleName + '.appController',
            controllerAs: 'vm'
        });

    $urlRouterProvider.otherwise('/app');
}

config.$inject = ['$stateProvider', '$urlRouterProvider'];

angular.module(moduleName,
    [
        uiRoute,
        hssPrototype
    ]
)
    .controller(moduleName + '.appController', AppController)
    .config(config);

export default moduleName;
