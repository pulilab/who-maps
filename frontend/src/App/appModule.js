/* global define DEV, DEBUG */

// General imports
import angular from 'angular';
import uiRoute from 'angular-ui-router';
import ngMessages from 'angular-messages';
import 'angular-password';
import angularMd from 'angular-material';

import _appTemplate from './app.html';
import Storage from '../Common/Storage';

import './app.scss';

const singletonCollection = [];

window.addEventListener('singletonRegistered', evt => {
    singletonCollection.push(evt.detail);
});


const moduleName = 'app';

const config = ($stateProvider, $urlRouterProvider, $locationProvider, $anchorScrollProvider) => {
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
                  template: '<project layout-fill layout="column" ></project>'
              }
          }
      })
      .state('editProject', {
          url: '/edit-project',
          parent: 'app',
          views: {
              main: {
                  template: '<project edit-mode="true" layout-fill layout="column" ></project>'
              }
          }
      })
      .state('inventory', {
          url: '/inventory',
          parent: 'app',
          views: {
              main: {
                  template: '<project inventory-mode="true" ></project>'
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
    $anchorScrollProvider.disableAutoScrolling();
};

function handleStateChange(event, toState) {
    if (DEBUG) {
        console.debug(`Ui route state change ${this} :`, toState.name);
    }
    if (this === 'success') {
        const mainContent = document.getElementsByClassName('main-content')[0];
        if (mainContent) {
            mainContent.scrollTop = 0;
        }
    }
}

const run = ($rootScope, $state, $mdToast, $mdDialog) => {
    $rootScope.$on('$stateChangeStart', handleStateChange.bind('start'));
    $rootScope.$on('$stateChangeError', handleStateChange.bind('error'));
    $rootScope.$on('$stateChangeSuccess', handleStateChange.bind('success'));

    const checkXHR = (event) => {
        $rootScope.progress = event.detail.progression;
        $rootScope.showLoading = $rootScope.progress !== 100;
        $rootScope.$evalAsync();
    };

    const showPopUp = () => {
        $mdToast.show(
          $mdToast.simple()
            .textContent('Ops! something went wrong, try again later.')
            .position('bottom right')
            .hideDelay(3000)
        );
    };

    let processingAuth = false;
    const handleAuthProblem = () => {
        if (!processingAuth) {
            processingAuth = true;
            const storage = new Storage();
            const token = storage.get('token');
            storage.clear();
            singletonCollection.forEach(purgeFunction => {
                if (purgeFunction) {
                    purgeFunction();
                }
            });
            const mainUi = window.document.querySelector('ui-view');
            mainUi.style.display = 'none';
            const message = token ? 'You session has expired, please login again.' :
              'You need to be logged in to view this content';
            const dialog = $mdDialog.show(
              $mdDialog.alert()
                .clickOutsideToClose(false)
                .title('Auth problem')
                .textContent(message)
                .ariaLabel('Auth problem dialog')
                .ok('Understand')
            );
            dialog.then(() => {
                mainUi.style.display = '';
                $state.go('landing');
                processingAuth = false;
            });
        }
    };
    window.addEventListener('xhrmonitor', checkXHR.bind(this));
    window.addEventListener('xhrFailedRequest', showPopUp.bind(this));
    window.addEventListener('xhrAuthProblem', handleAuthProblem.bind(this));
};

run.$inject = ['$rootScope', '$state', '$mdToast', '$mdDialog'];


config.$inject = ['$stateProvider', '$urlRouterProvider', '$locationProvider', '$anchorScrollProvider'];

const AppComponent = require('./appComponent');
const SystemController = require('./SystemController');

angular.module(moduleName,
    [
        uiRoute,
        angularMd,
        ngMessages,
        'ngPassword',
        require('../Common/').Components,
        require('../Project/'),
        require('../Cms/'),
        require('../CountryView/'),
        require('../Dashboard/'),
        require('../LandingPage/'),
        require('../MapsToolkit/')
    ]
)
  .controller('systemController', SystemController.systemControllerFactory())
  .component(AppComponent.name, AppComponent)
  .config(config)
  .run(run);


export default moduleName;
