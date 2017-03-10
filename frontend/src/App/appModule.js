/* global define DEV, DEBUG */

// General imports
import angular from 'angular';
import uiRoute from 'angular-ui-router';
import ngMessages from 'angular-messages';
import 'angular-password';
import angularMd from 'angular-material';

import _appTemplate from './app.html';

import cms from '../Cms/';
import { default as countryView } from '../CountryView/';
import dashboard from '../Dashboard/';
import landingPage from '../LandingPage/';
import mapsToolkit from '../MapsToolkit/';
import { Components, Storage } from '../Common/';

import AppComponent from './appComponent';
import SystemController from './SystemController';
import './app.scss';


const moduleName = 'app';
const config = ($stateProvider, $urlRouterProvider, $locationProvider) => {
    $stateProvider

        .state('base', {
            url: '',
            template: _appTemplate,
            controller: 'systemController',
            controllerAs: 'vm',
            abstract: true
        })

        .state('share', {
            url: '/project/:projectUUID',
            template: '<uuid-load />',
            controllerAs: 'vm'
        })

        .state(moduleName, {
            url: '/app/:appName',
            template: '<app layout="column" layout-fill></app>',
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
        .state('public', {
            url: '/public/:appName',
            template: '<app layout="column" view-mode="true"></app>',
            resolve: {
                project: ['$q', ($q) => {
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
        .state('reset', {
            url: '/reset',
            parent: 'base',
            views: {
                main: {
                    template: '<reset></reset>'
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
                    template: '<new-project layout-fill layout="column" ></new-project>'
                }
            }
        })
        .state('editProject', {
            url: '/edit-project',
            parent: 'app',
            views: {
                main: {
                    template: '<new-project edit-mode="true" layout-fill layout="column" ></new-project>'
                }
            }
        })
        .state('inventory', {
            url: '/inventory',
            parent: 'app',
            views: {
                main: {
                    template: '<new-project inventory-mode="true" ></new-project>'
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
        })

        .state('emailConfirmation', {
            url: '/email-confirmation/:key',
            parent: 'base',
            views: {
                main: {
                    template: '<email-confirmation></email-confirmation>'
                }
            }
        })
        .state('refreshProjects', {
            url: '/refresh-projects',
            parent: 'app',
            views: {
                main: {
                    template: '<refresh-project></refresh-project>'
                }
            }
        })
        .state('terms-of-use', {
            url: '/terms-of-use',
            parent: 'base',
            views: {
                main: {
                    template: '<terms-of-use></terms-of-use>'

                }
            }
        });

    $urlRouterProvider.otherwise('/landing');
    $locationProvider.html5Mode(true);
};

function handleStateChange(event, toState) {
    if (DEBUG) {
        console.debug(`Ui route state change ${this} :`, toState.name);
    }
    if (this === 'success') {
        document.body.scrollTop = document.documentElement.scrollTop = 0;
    }
}

const run = ($rootScope, $state) => {
    $rootScope.$on('$stateChangeStart', handleStateChange.bind('start'));
    $rootScope.$on('$stateChangeError', handleStateChange.bind('error'));
    $rootScope.$on('$stateChangeSuccess', handleStateChange.bind('success'));


    const checkXHR = (event) => {
        $rootScope.progress = event.detail.progression;
        $rootScope.showLoading = $rootScope.progress !== 100;
        $rootScope.$evalAsync();
    };

    window.addEventListener('xhrmonitor', checkXHR.bind(this));

    window.EE.on('unauthorized', () => {
        const storage = new Storage();
        storage.clear();
        $state.go('landing');
        const cs = require('../Common/CommonServices');
        cs.reset();
    });

};

run.$inject = ['$rootScope', '$state'];


config.$inject = ['$stateProvider', '$urlRouterProvider', '$locationProvider'];

angular.module(moduleName,
    [
        uiRoute,
        angularMd,
        ngMessages,
        'ngPassword',
        Components,
        cms,
        countryView,
        dashboard,
        landingPage,
        mapsToolkit
    ]
    )
    .controller('systemController', SystemController.systemControllerFactory())
    .component(AppComponent.name, AppComponent)
    .config(config)
    .run(run);


export default moduleName;
