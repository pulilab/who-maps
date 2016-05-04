import angular from 'angular';
import ngSanitize from 'angular-sanitize';
/* global define  Promise, $compileProvider */

import _template from './MapsToolkitModule.html';
import uiRoute from 'angular-ui-router';
import { Components } from '../Common/';

const moduleName = 'maps';

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
                provider.register(element, ctrl.default.mapsControllerFactory());
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
            url: '/maps/:axisId/:domainId',
            parent: 'app',
            views: {
                main: {
                    template: _template,
                    controllerProvider: () => 'MapsToolkitModuleController',
                    controllerAs: 'vm',
                    resolve: {
                        'ctrl': () => {
                            return lazyLoader($controllerProvider, 'MapsToolkitModuleController', 'controller');
                        },
                        'axisFooter': () => {
                            return lazyLoader($compileProvider, 'AxisFooter/axisFooterComponent.js', 'component');
                        },
                        'thematic': () => {
                            return lazyLoader($compileProvider, 'Thematic/thematicComponent.js', 'component');
                        }
                    }
                }
            }
        })
        .state('scorecard',
        {
            url: '/scorecard/:axisId',
            parent: 'app',
            views: {
                main: {
                    template: '<scorecard></scorecard>',
                    resolve: {
                        'scorecard': () => {
                            return lazyLoader($compileProvider, 'Scorecard/scorecardComponent.js', 'component');
                        },
                        'thematic': () => {
                            return lazyLoader($compileProvider, 'Thematic/thematicComponent.js', 'component');
                        },
                        'axisFooter': () => {
                            return lazyLoader($compileProvider, 'AxisFooter/axisFooterComponent.js', 'component');
                        }
                    }
                }
            }
        })
        .state('summary',
        {
            url: '/summary',
            parent: 'app',
            views: {
                main: {
                    template: '<scorecard summary="true"></scorecard>',
                    resolve: {
                        'scorecard': () => {
                            return lazyLoader($compileProvider, 'Scorecard/scorecardComponent.js', 'component');
                        },
                        'thematic': () => {
                            return lazyLoader($compileProvider, 'Thematic/thematicComponent.js', 'component');
                        },
                        'axisFooter': () => {
                            return lazyLoader($compileProvider, 'AxisFooter/axisFooterComponent.js', 'component');
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
        ngSanitize,
        Components
    ]
)
    .config(config);

export default moduleName;
