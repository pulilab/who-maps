import angular from 'angular';
import uiRoute from 'angular-ui-router';
import { StaticUtilities } from '../StaticUtilities';
/* global Promise */

const moduleName = 'dashboard';
const su = new StaticUtilities('Dashboard');


function config($stateProvider, $compileProvider) {
    $stateProvider
        .state(moduleName,
        {
            url: '/dashboard',
            parent: 'app',
            views: {
                main: {
                    template: '<dashboard></dashboard>',
                    resolve: {
                        'dashboard': () => {
                            return su.lazyLoader($compileProvider, 'dashboardComponent');
                        },
                        'linechart': () => {
                            return su.lazyLoader($compileProvider, 'Linechart/linechart');
                        },
                        'countrymap': () => {
                            return su.lazyLoader($compileProvider, 'CountryMap/countrymap');
                        }
                    }
                }
            }
        });
}

config.$inject = ['$stateProvider', '$compileProvider'];

angular.module(moduleName, [uiRoute])
    .config(config);

export default moduleName;
