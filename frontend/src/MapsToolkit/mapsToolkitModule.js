import angular from 'angular';
import MapsToolkitModuleController from './MapsToolkitModuleController';
import sampleComponent from './SampleComponent/sampleComponent';

import _template from './MapsToolkitModule.html';
import uiRoute from 'angular-ui-router';

const moduleName = 'mapsToolkitModule';

function config($stateProvider) {
    $stateProvider
        .state(moduleName,
        {
            url: '/maps',
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
    .controller(moduleName + '.' + moduleName + 'Controller', MapsToolkitModuleController)
    .component('sampleComponent', sampleComponent)
    .config(config);

export default moduleName;
