import angular from 'angular';
import uiRoute from 'angular-ui-router';
import { StaticUtilities } from '../Utilities';
import * as CmsModule from '../store/modules/cms';
import * as ProjectModule from '../store/modules/projects';
/* global Promise */

const moduleName = 'assessment';
const su = new StaticUtilities('Assessment');


function config($stateProvider, $compileProvider) {
    $stateProvider
      .state(moduleName, {
          url: '/assessment',
          parent: 'app',
          profileRequired: true,
          views: {
              main: {
                  template: '<assessment></assessment>'
              }
          },
          resolve: {
              'assessment': () => {
                  return su.lazyLoader($compileProvider, 'assessmentComponent');
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
      .state('public-assessment', {
          url: '/assessment',
          parent: 'public',
          views: {
              main: {
                  template: '<assessment view-mode="true"></assessment>'
              }
          },
          resolve: {
              'assessment': () => {
                  return su.lazyLoader($compileProvider, 'assessmentComponent');
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
