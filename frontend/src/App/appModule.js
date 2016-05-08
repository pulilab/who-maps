/* global define DEV */

// General imports
import angular from 'angular';
import uiRoute from 'angular-ui-router';
import ngMessages from 'angular-messages';
import 'angular-password';
import angularMd from 'angular-material';
import { EE } from '../Common/';

EE.initialize();

import AppController from './AppModuleController';
import './app.scss';

import _appTemplate from './app.html';

import hssModule from '../HssModule/';
import cms from '../Cms/';
import countryView from '../CountryView/';
import dashboard from '../Dashboard/';
import landingPage from '../LandingPage/';
import mapsToolkit from '../MapsToolkit/';
import { Components } from '../Common/';


const moduleName = 'app';
const config = ($stateProvider, $urlRouterProvider) => {
    $stateProvider
    .state(moduleName,
        {
            url: '/app/:appName',
            template: _appTemplate,
            controller: moduleName + '.appController',
            controllerAs: 'vm'
        })
    .state('login',
        {
            url: '/login',
            parent: 'app',
            views: {
                main: {
                    template: '<login></login>'
                }
            }
        })
    .state('signup',
        {
            url: '/signup',
            parent: 'app',
            views: {
                main: {
                    template: '<signup></signup>'
                }
            }
        })
    .state('newProject',
        {
            url: '/new-project',
            parent: 'app',
            views: {
                main: {
                    template: '<new-project ></new-project>'
                }
            }
        })
        .state('editProject',
        {
            url: '/edit-project',
            parent: 'app',
            views: {
                main: {
                    template: '<new-project edit-mode="true" ></new-project>'
                }
            }
        });

    $urlRouterProvider.otherwise('/app//landing');
};

function logUiRouteEvents(...args) { console.log(`Ui route state change ${this} :`, args); }

const run = ($rootScope) => {
    if (DEV) {
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
    .config(config)
    .run(run);


export default moduleName;
