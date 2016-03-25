import angular from 'angular';
import CmsModuleController from './CmsModuleController';
import sampleComponent from './SampleComponent/sampleComponent';

import _template from './CmsModule.html';
import uiRoute from 'angular-ui-router';

const moduleName = 'cmsModule';

function config($stateProvider) {
    $stateProvider
        .state(moduleName,
        {
            url: '/cms',
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
    .controller(moduleName + '.' + moduleName + 'Controller', CmsModuleController)
    .component('sampleComponent', sampleComponent)
    .config(config);

export default moduleName;
