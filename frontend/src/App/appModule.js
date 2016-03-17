// General imports
import angular from 'angular';
import uiRoute from 'angular-ui-router';
import angularMd from 'angular-material';
import { EE } from '../Common/';

EE.initialize();

import AppController from './AppModuleController';
import './app.scss';

import appTemplate from './app.html';

import hssPrototype from '../HssPrototype/';
import cms from '../Cms/';
import countryView from '../CountryView/';
import dashboard from '../Dashboard/';
import landingPage from '../LandingPage/';
import mapsToolkit from '../MapsToolkit/';


const moduleName = 'app';

function config($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state(moduleName,
        {
            url: '/app',
            template: appTemplate,
            controller: moduleName + '.appController',
            controllerAs: 'vm'
        });

    $urlRouterProvider.otherwise('/app');
}

config.$inject = ['$stateProvider', '$urlRouterProvider'];

angular.module(moduleName,
    [
        uiRoute,
        angularMd,
        hssPrototype,
        cms,
        countryView,
        dashboard,
        landingPage,
        mapsToolkit
    ]
)
    .controller(moduleName + '.appController', AppController)
    .config(config);

export default moduleName;
