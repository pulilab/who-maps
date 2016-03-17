import angular from 'angular';
import SampleController from './SampleModuleController';
import sampleComponent from './SampleComponent/sampleComponent';

import _template from './sampleModule.html';
import uiRoute from 'angular-ui-router';

const moduleName = 'sampleModule';

function config($stateProvider) {
    $stateProvider
        .state(moduleName,
        {
            url: '/sampleModule',
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
    .controller(moduleName + '.' + moduleName + 'Controller', SampleController)
    .component('sampleComponent', sampleComponent)
    .config(config);

export default moduleName;
