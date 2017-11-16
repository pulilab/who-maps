import angular from 'angular';
import ngSanitize from 'angular-sanitize';
/* global define  Promise, $compileProvider */

import uiRoute from 'angular-ui-router';
import { Components } from '../Common/';
import { StaticUtilities } from '../Utilities';
import * as CmsModule from '../store/modules/cms';
import * as ToolkitModule from '../store/modules/toolkit';

const su = new StaticUtilities('MapsToolkit');

const moduleName = 'maps';

const config = ($stateProvider, $compileProvider) => {
    $stateProvider
      .state(moduleName, {
          url: '/maps/:axisId/:domainId',
          parent: 'app',
          params: {
              axisId: '0',
              domainId: '0'
          },
          views: {
              main: {
                  template: '<maps-toolkit layout="column" layout-fill></maps-toolkit>'
              }
          },
          resolve: {
              'main': () => {
                  return su.lazyLoader($compileProvider, 'mapsComponent');
              },
              'axisFooter': () => {
                  return su.lazyLoader($compileProvider, 'AxisFooter/axisFooterComponent.js');
              },
              cms: ['$ngRedux', ($ngRedux) => {
                  const cmsPromise = $ngRedux.dispatch(CmsModule.getCmsData());
                  const toolkitPromise = $ngRedux.dispatch(ToolkitModule.loadToolkitData());
                  return Promise.all([cmsPromise, toolkitPromise]);
              }]
          }
      })
      .state('scorecard', {
          url: '/scorecard/:axisId',
          parent: 'app',
          views: {
              main: {
                  template: '<scorecard ></scorecard>'
              }
          },
          resolve: {
              'scorecard': () => {
                  return su.lazyLoader($compileProvider, 'Scorecard/scorecardComponent.js');
              },
              'axisFooter': () => {
                  return su.lazyLoader($compileProvider, 'AxisFooter/axisFooterComponent.js');
              }
          }
      })
      .state('summary', {
          url: '/summary',
          parent: 'app',
          views: {
              main: {
                  template: '<scorecard layout-fill layout="column" summary="true"></scorecard>'
              }
          },
          resolve: {
              'scorecard': () => {
                  return su.lazyLoader($compileProvider, 'Scorecard/scorecardComponent.js');
              },
              'axisFooter': () => {
                  return su.lazyLoader($compileProvider, 'AxisFooter/axisFooterComponent.js');
              }
          }
      });
};

config.$inject = ['$stateProvider', '$compileProvider'];

angular.module(moduleName,
    [
        uiRoute,
        ngSanitize,
        Components
    ]
)
  .config(config);

export default moduleName;
