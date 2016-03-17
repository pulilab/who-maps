import angular from 'angular';
import LandingPageModuleController from './LandingPageModuleController';
import sampleComponent from './SampleComponent/sampleComponent';

import _template from './LandingPageModule.html';
import uiRoute from 'angular-ui-router';

const moduleName = 'landingPageModule';

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
    .component('sampleComponent', sampleComponent)
    .config(config);

export default moduleName;
