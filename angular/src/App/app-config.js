import { setDateLocaleProvider } from '../plugins/language';
import _appTemplate from './app.html';
import * as ProjectsModule from '../store/modules/projects';
import * as UserModule from '../store/modules/user';
import * as SystemModule from '../store/modules/system';
import * as CountriesModule from '../store/modules/countries';
import Storage from '../Storage';
import { reducers, middleware } from '../store/index';

const storage = new Storage();

async function baseUserResolver ($ngRedux) {
  await $ngRedux.dispatch(UserModule.loadProfile());
  await $ngRedux.dispatch(SystemModule.loadStaticData());
  const countries = $ngRedux.dispatch(CountriesModule.loadCountries());
  const structure = $ngRedux.dispatch(ProjectsModule.loadProjectStructure());
  const organisation = $ngRedux.dispatch(SystemModule.loadOrganisations());
  return Promise.all([countries, structure, organisation]);
}

async function shareUserResolver ($ngRedux) {
  return $ngRedux.dispatch(UserModule.loadProfile());
}

async function appDataResolver ($ngRedux) {
  await $ngRedux.dispatch(UserModule.loadProfile());
  await $ngRedux.dispatch(SystemModule.loadStaticData());
  const projects = $ngRedux.dispatch(ProjectsModule.loadUserProjects());
  const structure = $ngRedux.dispatch(ProjectsModule.loadProjectStructure());
  const profiles = $ngRedux.dispatch(SystemModule.loadUserProfiles());
  const countries = $ngRedux.dispatch(CountriesModule.loadCountries());
  const organisation = $ngRedux.dispatch(SystemModule.loadOrganisations());
  return Promise.all([projects, profiles, countries, structure, organisation]);
}

async function publicDataResolver ($ngRedux) {
  await $ngRedux.dispatch(UserModule.loadProfile());
  await $ngRedux.dispatch(SystemModule.loadStaticData());
  const projects = $ngRedux.dispatch(ProjectsModule.loadUserProjects());
  const structure = $ngRedux.dispatch(ProjectsModule.loadProjectStructure());
  const countries = $ngRedux.dispatch(CountriesModule.loadCountries());
  const organisation = $ngRedux.dispatch(SystemModule.loadOrganisations());
  return Promise.all([projects, countries, structure, organisation]);
}

function appNameMapper ($ngRedux) {
  const state = $ngRedux.getState();
  return ProjectsModule.getUserDefaultProject(state);
}

const config = ($stateProvider, $urlRouterProvider, $locationProvider,
  $anchorScrollProvider, $ngReduxProvider, $mdDateLocaleProvider) => {
  setDateLocaleProvider($mdDateLocaleProvider);

  $stateProvider
    .state('base', {
      url: '',
      template: _appTemplate,
      controller: 'systemController',
      controllerAs: 'vm',
      abstract: true,
      resolve: {
        user: ['$ngRedux', baseUserResolver]
      }
    })
    .state('share', {
      url: '/project/:projectUUID',
      template: '<uuid-load />',
      controllerAs: 'vm',
      resolve: {
        user: ['$ngRedux', shareUserResolver]
      }
    })
    .state('app', {
      url: '/app/:appName',
      template: '<app layout="column" layout-fill></app>',
      resolve: {
        data: ['$ngRedux', appDataResolver]
      },
      params: {
        appName: {
          value: ['$ngRedux', appNameMapper]
        }
      }
    })
    .state('public', {
      url: '/public/:appName',
      template: '<app layout="column" view-mode="true"></app>',
      resolve: {
        data: ['$ngRedux', publicDataResolver]
      }
    })
    .state('login', {
      url: '/login',
      parent: 'base',
      params: {
        location: null
      },
      forbidAuthenticated: true,
      views: {
        main: {
          template: '<login></login>'
        }
      }
    })
    .state('reset', {
      url: '/reset',
      parent: 'base',
      forbidAuthenticated: true,
      views: {
        main: {
          template: '<reset></reset>'
        }
      }
    })
    .state('signup', {
      url: '/signup',
      parent: 'base',
      forbidAuthenticated: true,
      views: {
        main: {
          template: '<signup></signup>'
        }
      }
    })
    .state('editProfile', {
      url: '/edit-profile',
      parent: 'base',
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

  const storeState = {
    state: {
      user: {
        token: storage.get('token') || undefined
      }
    }
  };

  if (process.env.NODE_ENV === 'DEBUG_STORE') {
    try {
      const debugState = require('./reduxDebugState');
      storeState.state = { ...debugState.store, user: { ...debugState.store.user, ...storeState.state.user } };
    } catch (e) {
      console.error('Missing debug state, please create a js file called: reduxDebugState  exporting a store module in the app folder');
    }
  }
  const reduxDevTools = window.__REDUX_DEVTOOLS_EXTENSION__;
  const storeExtension = reduxDevTools ? [reduxDevTools()] : undefined;
  $ngReduxProvider.createStoreWith(reducers, middleware, storeExtension, storeState.state);
};

config.$inject = [
  '$stateProvider',
  '$urlRouterProvider',
  '$locationProvider',
  '$anchorScrollProvider',
  '$ngReduxProvider',
  '$mdDateLocaleProvider'
];

export { baseUserResolver, shareUserResolver, appDataResolver, publicDataResolver, appNameMapper, config };
