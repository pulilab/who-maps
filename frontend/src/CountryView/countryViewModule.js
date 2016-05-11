/* global Promise */

import angular from 'angular';

import _template from './CountryViewModule.html';
import './CountryView.scss';
import uiRoute from 'angular-ui-router';

const moduleName = 'country';

const components = {};
const lazyLoader = (provider, element, type) => {
    const prom = new Promise((resolve) => {
        require([], require => {

            let ctrl;
            if (type === 'controller') {
                ctrl = require('./' + element);
            }
            if (type === 'component') {
                ctrl = require('../' + element);
            }

            if (type === 'component') {
                if (!components[element]) {
                    components[element] = true;
                    provider.component(ctrl.default.name, ctrl.default);
                }
            }
            if (type === 'controller') {
                provider.register(element, ctrl.default.countryControllerFactory());
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
            url: '/countryView',
            parent: 'app',
            views: {
                main: {
                    template: _template,
                    controllerProvider: () => 'CountryViewModuleController',
                    controllerAs: 'vm',
                    resolve: {
                        'ctrl': () => {
                            return lazyLoader($controllerProvider, 'CountryViewModuleController', 'controller');
                        },
                        'countrymap': () => {
                            return lazyLoader($compileProvider, 'Dashboard/CountryMap/countrymap.js', 'component');
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
