import angular from 'angular';

/* global Promise */

import _template from './Dashboard.html';
import './Dashboard.scss';
import uiRoute from 'angular-ui-router';

const moduleName = 'dashboard';

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
                provider.register(element, ctrl.default.dashboardControllerFactory());
            }
            resolve();
        });
    });
    return prom;
};

function config($stateProvider, $controllerProvider, $compileProvider) {
    $stateProvider
        .state(moduleName,
        {
            url: '/:axisId/dashboard',
            parent: 'app',
            views: {
                main: {
                    template: _template,
                    controllerProvider: () => 'DashboardModuleController',
                    controllerAs: 'vm',
                    resolve: {
                        'ctrl': () => {
                            return lazyLoader($controllerProvider, 'DashboardModuleController', 'controller');
                        },
                        'linechart': () => {
                            return lazyLoader($compileProvider, 'Linechart/linechart.js', 'component');
                        },
                        'countrymap': () => {
                            return lazyLoader($compileProvider, 'CountryMap/countrymap.js', 'component');
                        }
                    }
                }
            }
        });
}

config.$inject = ['$stateProvider', '$controllerProvider', '$compileProvider'];

angular.module(moduleName, [uiRoute])
    .config(config);

export default moduleName;
