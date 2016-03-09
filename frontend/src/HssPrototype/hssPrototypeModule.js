import angular from 'angular';
import uiRoute from 'angular-ui-router';
import ngMaterial from 'angular-material';

import HssModuleController from './HssModuleController';

import hssTemplate from './hssPrototype.html';
import './hssModule.scss';

const moduleName = 'hssPrototype';

function config($stateProvider) {
    $stateProvider
        .state(moduleName, {
            url: '/hssPrototype',
            parent: 'app',
            views: {
                main: {
                    template: hssTemplate,
                    controller: moduleName + '.hssModuleController',
                    controllerAs: 'vm'
                }
            }
        });

}

config.$inject = ['$stateProvider'];

angular.module(moduleName,
    [
        uiRoute,
        ngMaterial
    ])
    .controller(moduleName + '.hssModuleController', HssModuleController)
    .config(config);

export default moduleName;
