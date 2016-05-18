import angular from 'angular';
import ngSanitize from 'angular-sanitize';
/* global define  Promise, $compileProvider */

import uiRoute from 'angular-ui-router';
import { Components } from '../Common/';
import { StaticUtilities } from '../StaticUtilities';

const su = new StaticUtilities('MapsToolkit');

const moduleName = 'maps';

const config = ($stateProvider, $compileProvider) => {
    $stateProvider
        .state(moduleName,
        {
            url: '/maps/:axisId/:domainId',
            parent: 'app',
            views: {
                main: {
                    template: '<maps-toolkit></maps-toolkit>',
                    resolve: {
                        'main': () => {
                            return su.lazyLoader($compileProvider, 'mapsComponent');
                        },
                        'axisFooter': () => {
                            return su.lazyLoader($compileProvider, 'AxisFooter/axisFooterComponent.js');
                        },
                        'thematic': () => {
                            return su.lazyLoader($compileProvider, 'Thematic/thematicComponent.js');
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
                            return su.lazyLoader($compileProvider, 'Scorecard/scorecardComponent.js');
                        },
                        'thematic': () => {
                            return su.lazyLoader($compileProvider, 'Thematic/thematicComponent.js');
                        },
                        'axisFooter': () => {
                            return su.lazyLoader($compileProvider, 'AxisFooter/axisFooterComponent.js');
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
                            return su.lazyLoader($compileProvider, 'Scorecard/scorecardComponent.js');
                        },
                        'thematic': () => {
                            return su.lazyLoader($compileProvider, 'Thematic/thematicComponent.js');
                        },
                        'axisFooter': () => {
                            return su.lazyLoader($compileProvider, 'AxisFooter/axisFooterComponent.js');
                        }
                    }
                }
            }
        });
};

config.$inject = ['$stateProvider', '$compileProvider'];

angular.module(moduleName,
    [
        uiRoute,
        ngSanitize,
        Components
    ]
)
    .config(config);

export default moduleName;
