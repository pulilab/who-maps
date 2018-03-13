/* global Promise */
import angular from 'angular';
import uiRoute from 'angular-ui-router';
import { StaticUtilities } from '../Utilities';

const moduleName = 'dashboard';
const su = new StaticUtilities('Dashboard');

function config($stateProvider, $compileProvider) {
    $stateProvider
      .state(moduleName, {
          url: '/dashboard',
          parent: 'base',
          profileRequired: true,
          views: {
              main: {
                  template: '<dashboard></dashboard>'
              }
          },
          resolve: {
              'country': () => {
                  return su.lazyLoader($compileProvider, 'dashboardComponent');
              }
          }
      });
}

config.$inject = ['$stateProvider', '$compileProvider'];

angular.module(moduleName, [uiRoute])
  .config(config);

export default moduleName;
