/* global Promise */
import angular from 'angular';
import uiRoute from 'angular-ui-router';
import { StaticUtilities } from '../Utilities';

const moduleName = 'country';
const su = new StaticUtilities('CountryView');

function config($stateProvider, $compileProvider) {
    $stateProvider
      .state(moduleName, {
          url: '/country',
          parent: 'app',
          profileRequired: true,
          views: {
              main: {
                  template: '<country-view></country-view>'
              }
          },
          resolve: {
              'country': () => {
                  return su.lazyLoader($compileProvider, 'countryViewComponent');
              }
          }
      });
}

config.$inject = ['$stateProvider', '$compileProvider'];

angular.module(moduleName, [uiRoute])
  .config(config);

export default moduleName;
