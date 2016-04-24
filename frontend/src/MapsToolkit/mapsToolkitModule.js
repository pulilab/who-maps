import angular from 'angular';

/* global define  Promise, $compileProvider */

import _template from './MapsToolkitModule.html';
import uiRoute from 'angular-ui-router';
import { Components } from '../Common/';

const moduleName = 'maps';

const lazyLoader = (provider, element, type) => {
    const prom = new Promise((resolve) => {
        require([], require => {
            const ctrl = require('./' + element);
            if (type === 'component') {
                provider.component(ctrl.default.name, ctrl.default);
            }
            if (type === 'controller') {
                provider.register(element, ctrl.default.mapsControllerFactory());
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
            url: '/maps',
            parent: 'app',
            views: {
                main: {
                    template: _template,
                    controllerProvider: () => 'MapsToolkitModuleController',
                    controllerAs: 'vm',
                    resolve: {
                        'ctrl': () => {
                            return lazyLoader($controllerProvider, 'MapsToolkitModuleController', 'controller');
                        }
                    }
                }
            }
        });
}

config.$inject = ['$stateProvider', '$controllerProvider', '$compileProvider'];

angular.module(moduleName,
    [
        uiRoute,
        Components
    ]
)
    .config(config);

export default moduleName;
