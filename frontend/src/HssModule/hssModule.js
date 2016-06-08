import angular from 'angular';
import uiRoute from 'angular-ui-router';
import ngMaterial from 'angular-material';

import { StaticUtilities } from '../Utilities';
/* global define, Promise */


import './hssModule.scss';

const moduleName = 'hss';

const su = new StaticUtilities('HssModule');

function config($stateProvider, $compileProvider) {
    $stateProvider
        .state(moduleName, {
            url: '/hss',
            parent: 'app',
            views: {
                main: {
                    template: '<hss-module></hss-module>',
                    resolve: {
                        'ctrl': () => {
                            return su.lazyLoader($compileProvider, 'hssModuleComponent');
                        },
                        'continuum': () => {
                            return su.lazyLoader($compileProvider, 'Continuum/continuumComponent');
                        },
                        'interventions': () => {
                            return su.lazyLoader($compileProvider, 'Interventions/interventionsComponent');
                        },
                        'constraints': () => {
                            return su.lazyLoader($compileProvider, 'Constraints/constraintsComponent');
                        },
                        'applications': () => {
                            return su.lazyLoader($compileProvider, 'Applications/applicationsComponent');
                        },
                        'projectScale': () => {
                            return su.lazyLoader($compileProvider, 'ProjectScale/projectScaleComponent');
                        },
                        'projectPartners': () => {
                            return su.lazyLoader($compileProvider, 'ProjectPartners/projectPartnersComponent');
                        },
                        'hint': () => {
                            return su.lazyLoader($compileProvider, 'Hint/hintComponent');
                        }
                    }

                }
            }
        })
        .state('public-hss', {
            url: '/hss',
            parent: 'public',
            views: {
                main: {
                    template: '<hss-module view-mode="true"></hss-module>',
                    resolve: {
                        'ctrl': () => {
                            return su.lazyLoader($compileProvider, 'hssModuleComponent');
                        },
                        'continuum': () => {
                            return su.lazyLoader($compileProvider, 'Continuum/continuumComponent');
                        },
                        'interventions': () => {
                            return su.lazyLoader($compileProvider, 'Interventions/interventionsComponent');
                        },
                        'constraints': () => {
                            return su.lazyLoader($compileProvider, 'Constraints/constraintsComponent');
                        },
                        'applications': () => {
                            return su.lazyLoader($compileProvider, 'Applications/applicationsComponent');
                        },
                        'projectScale': () => {
                            return su.lazyLoader($compileProvider, 'ProjectScale/projectScaleComponent');
                        },
                        'projectPartners': () => {
                            return su.lazyLoader($compileProvider, 'ProjectPartners/projectPartnersComponent');
                        },
                        'hint': () => {
                            return su.lazyLoader($compileProvider, 'Hint/hintComponent');
                        }
                    }

                }
            }
        });

}

config.$inject = ['$stateProvider', '$compileProvider'];

angular.module(moduleName,
    [
        uiRoute,
        ngMaterial
    ])
    .config(config);


export default moduleName;
