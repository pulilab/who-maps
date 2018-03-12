import angular from 'angular';
import uiRoute from 'angular-ui-router';
import { StaticUtilities } from '../Utilities';
import * as CmsModule from '../store/modules/cms';
import * as ProjectModule from '../store/modules/projects';
/* global Promise */

const moduleName = 'assesment';
const su = new StaticUtilities('Assesment');


function config($stateProvider, $compileProvider) {
    $stateProvider
      .state(moduleName, {
          url: '/assesment',
          parent: 'app',
          profileRequired: true,
          views: {
              main: {
                  template: '<assesment></assesment>'
              }
          },
          resolve: {
              'assesment': () => {
                  return su.lazyLoader($compileProvider, 'assesmentComponent');
              },
              'linechart': () => {
                  return su.lazyLoader($compileProvider, 'Linechart/linechart');
              },
              'statistics': () => {
                  return su.lazyLoader($compileProvider, 'Statistics/statisticsComponent');
              },
              cms: ['$ngRedux', ($ngRedux) => {
                  return $ngRedux.dispatch(CmsModule.loadCmsData());
              }],
              projects: ['$ngRedux', ($ngRedux) => {
                  return $ngRedux.dispatch(ProjectModule.loadUserProjects());
              }]
          }
      })
      .state('public-assesment', {
          url: '/assesment',
          parent: 'public',
          views: {
              main: {
                  template: '<assesment view-mode="true"></assesment>'
              }
          },
          resolve: {
              'assesment': () => {
                  return su.lazyLoader($compileProvider, 'assesmentComponent');
              },
              'linechart': () => {
                  return su.lazyLoader($compileProvider, 'Linechart/linechart');
              },
              'statistics': () => {
                  return su.lazyLoader($compileProvider, 'Statistics/statisticsComponent');
              }
          }
      });
}

config.$inject = ['$stateProvider', '$compileProvider'];

angular.module(moduleName, [uiRoute])
  .config(config);

export default moduleName;
