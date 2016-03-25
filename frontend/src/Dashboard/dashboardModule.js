import angular from 'angular';
import DashboardModuleController from './DashboardModuleController';
import sampleComponent from './SampleComponent/sampleComponent';

import _template from './DashboardModule.html';
import uiRoute from 'angular-ui-router';

const moduleName = 'dashboardModule';

function config($stateProvider) {
    $stateProvider
        .state(moduleName,
        {
            url: '/dashboard',
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
    .controller(moduleName + '.' + moduleName + 'Controller', DashboardModuleController)
    .component('sampleComponent', sampleComponent)
    .config(config);

export default moduleName;
