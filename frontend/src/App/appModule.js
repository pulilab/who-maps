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

function config($stateProvider, $urlRouterProvider) {
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
        });

    $urlRouterProvider.otherwise('/app//landing');
}

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
    .config(config);

export default moduleName;
