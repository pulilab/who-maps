import angular from 'angular';
import HssModuleController from './HssModuleController';

import hssTemplate from './hssPrototype.html';
import uiRoute from 'angular-ui-router';

const moduleName = 'hssPrototype';

console.log(moduleName, ' loaded');

function config($stateProvider) {
    $stateProvider
        .state(moduleName,
        {
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

angular.module(moduleName, [uiRoute])
    .controller(moduleName + '.hssModuleController', HssModuleController)
    .config(config);

export default moduleName;
