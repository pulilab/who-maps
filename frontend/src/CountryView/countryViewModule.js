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
          views: {
              main: {
                  template: '<country-view></country-view>'
              }
          },
          resolve: {
              'country': () => {
                  return su.lazyLoader($compileProvider, 'countryViewComponent');
              }
          },
          profileRequired: true
      })
      .state('pdf-export', {
          url: '/pdf-export',
          template: '<pdf-export instant-download="true"></pdf-export>',
          resolve: {
              'pdf-export': () => {
                  return su.lazyLoader($compileProvider, 'PDFExport/PDFExportComponent');
              }
          }
      });
}

config.$inject = ['$stateProvider', '$compileProvider'];

angular.module(moduleName, [uiRoute])
  .config(config);

export default moduleName;
