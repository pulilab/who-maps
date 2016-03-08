import angular from 'angular';
import SampleController from './SampleModuleController';
import sampleComponent from './SampleComponent/sampleComponent';

import sampleTemplate from './sampleModule.html';
import uiRoute from 'angular-ui-router';

const moduleName = 'sampleModule';

function config($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state(moduleName,
        {
            url: '/sampleModule',
            template: sampleTemplate,
            controller: 'sampleModule.sampleModuleController',
            controllerAs: 'vm'
        });
    $urlRouterProvider.otherwise('/sampleModule');
}

config.$inject = ['$stateProvider', '$urlRouterProvider'];

angular.module(moduleName, [uiRoute])
    .controller('sampleModule.sampleModuleController', SampleController)
    .component('sampleComponent', sampleComponent)
    .config(config);

export default moduleName;
