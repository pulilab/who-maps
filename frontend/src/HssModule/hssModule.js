import angular from 'angular';
import uiRoute from 'angular-ui-router';
import ngMaterial from 'angular-material';

/* global define, Promise */


import hssTemplate from './HssModule.html';
import './hssModule.scss';

const moduleName = 'hss';

const lazyLoader = (provider, element, type) => {
    const prom = new Promise((resolve) => {
        require([], require => {
            const ctrl = require('./' + element);
            if (type === 'component') {
                provider.component(ctrl.default.name, ctrl.default);
            }
            if (type === 'controller') {
                provider.register(element, ctrl.default.hssControllerFactory());
            }
            resolve();
        });
    });
    return prom;
};


function config($stateProvider, $controllerProvider, $compileProvider) {
    $stateProvider
        .state(moduleName, {
            url: '/hss',
            parent: 'app',
            views: {
                main: {
                    template: hssTemplate,
                    controllerProvider: () => 'HssModuleController',
                    controllerAs: 'vm',
                    resolve: {
                        'ctrl': () => {
                            return lazyLoader($controllerProvider, 'HssModuleController', 'controller');
                        },
                        'continuum': () => {
                            return lazyLoader($compileProvider, 'Continuum/continuumComponent', 'component');
                        },
                        'interventions': () => {
                            return lazyLoader($compileProvider, 'Interventions/interventionsComponent', 'component');
                        },
                        'constraints': () => {
                            return lazyLoader($compileProvider, 'Constraints/constraintsComponent', 'component');
                        },
                        'applications': () => {
                            return lazyLoader($compileProvider, 'Applications/applicationsComponent', 'component');
                        },
                        'projectScale': () => {
                            return lazyLoader($compileProvider, 'ProjectScale/projectScaleComponent', 'component');
                        },
                        'projectPartners': () => {
                            return lazyLoader($compileProvider, 'ProjectPartners/projectPartnersComponent', 'component');
                        },
                        'hint': () => {
                            return lazyLoader($compileProvider, 'Hint/hintComponent', 'component');
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
        ngMaterial
    ])
    .config(config);


export default moduleName;
