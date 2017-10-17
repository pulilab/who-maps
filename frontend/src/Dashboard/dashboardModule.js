import angular from 'angular';
import uiRoute from 'angular-ui-router';
import { StaticUtilities } from '../Utilities';
import * as CmsModule from '../store/modules/cms';
import * as ProjectModule from '../store/modules/projects';
/* global Promise */

const moduleName = 'dashboard';
const su = new StaticUtilities('Dashboard');


function config($stateProvider, $compileProvider) {
    $stateProvider
      .state(moduleName, {
          url: '/dashboard',
          parent: 'app',
          views: {
              main: {
                  template: '<dashboard></dashboard>'
              }
          },
          resolve: {
              'dashboard': () => {
                  return su.lazyLoader($compileProvider, 'dashboardComponent');
              },
              'linechart': () => {
                  return su.lazyLoader($compileProvider, 'Linechart/linechart');
              },
              cms: ['$ngRedux', ($ngRedux) => {
                  return $ngRedux.dispatch(CmsModule.getCmsData());
              }],
              projects: ['$ngRedux', ($ngRedux) => {
                  return $ngRedux.dispatch(ProjectModule.loadUserProjects());
              }]
          }
      })
      .state('public-dashboard', {
          url: '/dashboard',
          parent: 'public',
          views: {
              main: {
                  template: '<dashboard view-mode="true"></dashboard>'
              }
          },
          resolve: {
              'dashboard': () => {
                  return su.lazyLoader($compileProvider, 'dashboardComponent');
              },
              'linechart': () => {
                  return su.lazyLoader($compileProvider, 'Linechart/linechart');
              }
          }
      });
}

config.$inject = ['$stateProvider', '$compileProvider'];

angular.module(moduleName, [uiRoute])
  .config(config);

export default moduleName;
