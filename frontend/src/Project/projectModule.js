import angular from 'angular';
import * as ProjectsModule from '../store/modules/projects';
import { StaticUtilities } from '../Utilities';

const moduleName = 'Project';

const su = new StaticUtilities('Project');

function config ($stateProvider, $compileProvider) {
  $stateProvider.state('newProject', {
    url: '/new-project/:editMode/',
    parent: 'app',
    views: {
      main: {
        template: '<project layout-fill layout="column" ></project>'
      }
    },
    resolve: {
      'components': () => {
        const component = su.lazyLoader($compileProvider, 'projectComponent');
        const interoperability = su.lazyLoader($compileProvider,
          'Interoperability/interoperabilityComponent.js');
        const generalOverview = su.lazyLoader($compileProvider,
          'GeneralOverview/generalOverviewComponent.js');
        const navigation = su.lazyLoader($compileProvider,
          'Navigation/navigationComponent.js');
        const implementationOverview = su.lazyLoader($compileProvider,
          'ImplementationOverview/implementationOverviewComponent.js');
        const technology = su.lazyLoader($compileProvider,
          'Technology/technologyComponent.js');
        const countryFields = su.lazyLoader($compileProvider,
          'CountryFields/countryFieldsComponent.js');
        const dialogMultiSelection = su.lazyLoader($compileProvider,
          'DialogMultiSelector/dialogMultiSelectorComponent.js');

        return Promise.all([component, interoperability, generalOverview, navigation,
          implementationOverview, technology, countryFields, dialogMultiSelection]);
      },
      user: ['$ngRedux', ($ngRedux) => {
        return $ngRedux.dispatch(ProjectsModule.loadProjectStructure());
      }]
    },
    params: {
      editMode: 'draft'
    },
    profileRequired: true
  })
    .state('editProject', {
      url: '/edit-project/:editMode/',
      parent: 'app',
      params: {
        editMode: 'draft'
      },
      views: {
        main: {
          template: '<project edit-mode="true" layout-fill layout="column" ></project>'
        }
      },
      resolve: {
        'components': () => {
          const component = su.lazyLoader($compileProvider, 'projectComponent');
          const interoperability = su.lazyLoader($compileProvider,
            'Interoperability/interoperabilityComponent.js');
          const generalOverview = su.lazyLoader($compileProvider,
            'GeneralOverview/generalOverviewComponent.js');
          const navigation = su.lazyLoader($compileProvider,
            'Navigation/navigationComponent.js');
          const implementationOverview = su.lazyLoader($compileProvider,
            'ImplementationOverview/implementationOverviewComponent.js');
          const technology = su.lazyLoader($compileProvider,
            'Technology/technologyComponent.js');
          const countryFields = su.lazyLoader($compileProvider,
            'CountryFields/countryFieldsComponent.js');
          const dialogMultiSelection = su.lazyLoader($compileProvider,
            'DialogMultiSelector/dialogMultiSelectorComponent.js');

          return Promise.all([component, interoperability, generalOverview, navigation,
            implementationOverview, technology, countryFields, dialogMultiSelection]);
        },
        user: ['$ngRedux', ($ngRedux) => {
          return $ngRedux.dispatch(ProjectsModule.loadProjectStructure());
        }]
      },
      profileRequired: true
    });
}

config.$inject = ['$stateProvider', '$compileProvider'];

angular.module(moduleName, [])
  .config(config);

export default moduleName;
