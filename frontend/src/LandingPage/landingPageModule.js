import angular from 'angular';
import { StaticUtilities } from '../Utilities';
/* global define Promise, $compileProvider */

import uiRoute from 'angular-ui-router';

const moduleName = 'landing';
const su = new StaticUtilities('LandingPage');

function config($stateProvider, $compileProvider) {
    $stateProvider
        .state(moduleName, {
            url: '/landing',
            parent: 'base',
            views: {
                main: {
                    template: '<landing-page></landing-page>',
                    resolve: {
                        'main': () => {
                            return su.lazyLoader($compileProvider, 'landingPageComponent');
                        }
                    }
                }
            }
        })
        .state('landing-logged', {
            url: '/landing',
            parent: 'app',
            views: {
                main: {
                    template: '<landing-page></landing-page>',
                    resolve: {
                        'main': () => {
                            return su.lazyLoader($compileProvider, 'landingPageComponent');
                        }
                    }
                }
            }
        });

}

config.$inject = ['$stateProvider', '$compileProvider'];


angular.module(moduleName, [uiRoute]).config(config);

export default moduleName;
