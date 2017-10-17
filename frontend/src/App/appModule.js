/* global define DEV, DEBUG */

// General imports
import angular from 'angular';
import uiRoute from 'angular-ui-router';
import ngMessages from 'angular-messages';
import 'angular-password';
import angularMd from 'angular-material';
import ngRedux from 'ng-redux';
import { reducers, middleware } from '../store/index';
import * as ProjectsModule from '../store/modules/projects';
import * as UserModule from '../store/modules/user';
import * as SystemModule from '../store/modules/system';
import axios from '../plugins/axios';

import _appTemplate from './app.html';
import Storage from '../Common/Storage';

import './app.scss';

const singletonCollection = [];

window.addEventListener('singletonRegistered', evt => {
    singletonCollection.push(evt.detail);
});

const storage = new Storage();

const config = ($stateProvider, $urlRouterProvider, $locationProvider, $anchorScrollProvider, $ngReduxProvider) => {
    $stateProvider
      .state('base', {
          url: '',
          template: _appTemplate,
          controller: 'systemController',
          controllerAs: 'vm',
          abstract: true,
          resolve: {
              user: ['$ngRedux', ($ngRedux) => {
                  return $ngRedux.dispatch(UserModule.getProfile());
              }]
          }
      })

      .state('share', {
          url: '/project/:projectUUID',
          template: '<uuid-load />',
          controllerAs: 'vm'
      })

      .state('app', {
          url: '/app/:appName',
          template: '<app layout="column" layout-fill></app>',
          resolve: {
              data: ['$ngRedux', async ($ngRedux) => {
                  await $ngRedux.dispatch(UserModule.getProfile());
                  const projects = $ngRedux.dispatch(ProjectsModule.loadUserProjects());
                  const profiles = $ngRedux.dispatch(SystemModule.getUserProfiles());
                  return Promise.all([projects, profiles]);
              }]
          },
          params: {
              appName: {
                  value: ['$ngRedux', ($ngRedux) => {
                      const state = $ngRedux.getState();
                      return state && state.projects && state.projects[0] ? '' + state.projects[0].id : null;
                  }]
              }
          }
      })
      .state('public', {
          url: '/public/:appName',
          template: '<app layout="column" view-mode="true"></app>',
          resolve: {
              project: () => {
                  const cs = require('../Common/CommonServices');
                  return cs.loadedPromise;
              }
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
          },
          profileRequired: true
      })
      .state('editProject', {
          url: '/edit-project',
          parent: 'app',
          views: {
              main: {
                  template: '<project edit-mode="true" layout-fill layout="column" ></project>'
              }
          },
          profileRequired: true
      })
      .state('inventory', {
          url: '/inventory',
          parent: 'app',
          views: {
              main: {
                  template: '<project inventory-mode="true" ></project>'
              }
          },
          profileRequired: true
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

    const initialState = {
        user: {
            token: storage.get('token') || undefined
        }
    };
    $ngReduxProvider.createStoreWith(reducers, middleware, [window.__REDUX_DEVTOOLS_EXTENSION__()], initialState);
};

function handleStateChange(type) {
    if (type === 'success') {
        const mainContent = document.getElementsByClassName('main-content')[0];
        if (mainContent) {
            mainContent.scrollTop = 0;
        }
    }
}

function checkProfile(profile, t) {
    if (!profile || !profile.name || !profile.country || !profile.organisation_id) {
        console.log('You can not navigate to that area without a user profile');
        return t.router.stateService.target('editProfile');
    }
    return Promise.resolve();
}

const run = ($rootScope, $state, $mdToast, $mdDialog, $ngRedux, $timeout, $transitions) => {
    const tkn = storage.get('token');
    if (tkn) {
        axios.setAuthToken(tkn);
    }

    $transitions.onStart({}, () => {
        handleStateChange('start');
        return Promise.resolve();
    });

    $transitions.onSuccess({}, () => {
        handleStateChange('success');
        return Promise.resolve();
    });

    $transitions.onError({}, () => {
        handleStateChange('error');
        return Promise.resolve();
    });

    $transitions.onFinish({}, (t) => {
        const to = t.to();
        if (to && to.profileRequired) {
            const state = $ngRedux.getState();
            return checkProfile(state.user.profile, t);
        }
        return Promise.resolve();
    });


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
    $ngRedux.subscribe(() => {
        $timeout(() => {$rootScope.$apply(() => {});}, 100);
    });
};

run.$inject = ['$rootScope', '$state', '$mdToast', '$mdDialog', '$ngRedux', '$timeout', '$transitions'];


config.$inject = ['$stateProvider', '$urlRouterProvider', '$locationProvider',
    '$anchorScrollProvider', '$ngReduxProvider'];

const AppComponent = require('./appComponent');
const SystemController = require('./SystemController');

angular.module('app',
    [
        uiRoute,
        angularMd,
        ngMessages,
        'ngPassword',
        ngRedux,
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


export default 'app';
