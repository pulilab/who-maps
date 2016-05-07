import angular from 'angular';
import LandingPageModuleController from './LandingPageModuleController';

/* global define Promise, $compileProvider */

import _template from './LandingPageModule.html';
import uiRoute from 'angular-ui-router';

const moduleName = 'landing';

const components = {};

const lazyLoader = (provider, element, type) => {
    const prom = new Promise((resolve) => {
        require([], require => {
            const ctrl = require('./' + element);
            if (type === 'component') {
                if (!components[element]) {
                    components[element] = true;
                    provider.component(ctrl.default.name, ctrl.default);
                }
            }
            if (type === 'controller') {
                provider.register(element, ctrl.default.landingControllerFactory());
            }
            resolve();
        });
    });
    return prom;
};


function config($stateProvider, $controllerProvider) {
    $stateProvider
        .state(moduleName,
        {
            url: '/landing',
            parent: 'app',
            views: {
                main: {
                    template: _template,
                    // controller: moduleName + '.' + moduleName + 'Controller',
                    controllerAs: 'vm',
                    controllerProvider: () => 'LandingPageModuleController',
                    resolve: {
                        'ctrl': () => {
                            return lazyLoader($controllerProvider, 'LandingPageModuleController', 'controller');
                        }
                    }
                }
            }
        });
}

config.$inject = ['$stateProvider', '$controllerProvider'];


angular.module(moduleName, [uiRoute])
    .controller(moduleName + '.' + moduleName + 'Controller', LandingPageModuleController)
    .config(config);

export default moduleName;
