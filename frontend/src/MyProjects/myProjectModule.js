import angular from 'angular';
import uiRoute from 'angular-ui-router';
import { StaticUtilities } from '../Utilities';
import * as SystemModule from '../store/modules/system';
import * as ProjectModule from '../store/modules/projects';

const su = new StaticUtilities('MyProjects');

function config ($stateProvider, $compileProvider) {
  $stateProvider
    .state('my-projects',
      {
        url: '/my-projects',
        parent: 'app',
        views: {
          main: {
            component: 'myProjectList'
          }
        },
        resolve: {
          'main': () => {
            return su.lazyLoader($compileProvider, 'MyProjectList/myProjectListComponent');
          },
          resolvesData: ['$ngRedux', async ($ngRedux) => {
            await $ngRedux.dispatch(SystemModule.loadUserProfiles());
            return $ngRedux.dispatch(ProjectModule.loadUserProjects());
          }]
        },
        profileRequired: true
      });
}

config.$inject = ['$stateProvider', '$compileProvider'];
const moduleName = 'myProjects';

angular.module(moduleName, [uiRoute])
  .config(config);

export default moduleName;
