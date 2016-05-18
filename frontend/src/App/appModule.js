/* global define DEV, DEBUG */

// General imports
import angular from 'angular';
import uiRoute from 'angular-ui-router';
import ngMessages from 'angular-messages';
import 'angular-password';
import angularMd from 'angular-material';

import _appTemplate from './app.html';

import hssModule from '../HssModule/';
import cms from '../Cms/';
import countryView from '../CountryView/';
import dashboard from '../Dashboard/';
import landingPage from '../LandingPage/';
import mapsToolkit from '../MapsToolkit/';
import { Components } from '../Common/';


import AppController from './AppModuleController';
import SystemController from './SystemController';
import './app.scss';


const moduleName = 'app';
const config = ($stateProvider, $urlRouterProvider) => {
    $stateProvider

        .state('base', {
            url: '',
            template: _appTemplate,
            controller: 'systemController',
            controllerAs: 'vm',
            abstract: true
        })

        .state(moduleName, {
            url: '/app/:appName',
            template: _appTemplate,
            controller: moduleName + '.appController',
            controllerAs: 'vm',
            resolve: {
                data: ['$q', ($q) => {
                    const def = $q.defer();
                    const cs = require('../Common/CommonServices');
                    cs.loadedPromise
                        .then(() => {
                            def.resolve();
                        });

                    return def.promise;
                }]
            }

        })
        .state('login', {
            url: '/login',
            parent: 'base',
            views: {
                main: {
                    template: '<login></login>'
                }
            }
        })
        .state('signup', {
            url: '/signup',
            parent: 'base',
            views: {
                main: {
                    template: '<signup></signup>'
                }
            }
        })
        .state('newProject', {
            url: '/new-project',
            parent: 'app',
            views: {
                main: {
                    template: '<new-project ></new-project>'
                }
            }
        })
        .state('editProject', {
            url: '/edit-project',
            parent: 'app',
            views: {
                main: {
                    template: '<new-project edit-mode="true" ></new-project>'
                }
            }
        })
        .state('editProfile', {
            url: '/edit-profile',
            parent: 'app',
            views: {
                main: {
                    template: '<edit-profile ></edit-profile>'
                }
            }
        });

    $urlRouterProvider.otherwise('/landing');
};

function logUiRouteEvents(...args) { console.debug(`Ui route state change ${this} :`, args); }

const run = ($rootScope) => {
    if (DEBUG) {
        $rootScope.$on('$stateChangeError', logUiRouteEvents.bind('error'));
        $rootScope.$on('$stateChangeSuccess', logUiRouteEvents.bind('success'));
    }
};

run.$inject = ['$rootScope'];


config.$inject = ['$stateProvider', '$urlRouterProvider'];

angular.module(moduleName,
    [
        uiRoute,
        angularMd,
        ngMessages,
        'ngPassword',
        Components,
        hssModule,
        cms,
        countryView,
        dashboard,
        landingPage,
        mapsToolkit
    ]
    )
    .controller(moduleName + '.appController', AppController.appControllerFactory())
    .controller('systemController', SystemController.systemControllerFactory())
    .config(config)
    .run(run);


export default moduleName;
