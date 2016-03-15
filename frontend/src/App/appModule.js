import angular from 'angular';
import uiRoute from 'angular-ui-router';
import angularMd from 'angular-material';

import AppController from './AppModuleController';
import './app.scss';

import appTemplate from './app.html';

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
        hssPrototype,
        angularMd
    ]
)
    .controller(moduleName + '.appController', AppController)
    .config(config);

export default moduleName;
