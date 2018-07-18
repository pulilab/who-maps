import angular from 'angular';
import ngSanitize from 'angular-sanitize';
import 'angular-ui-router';
import 'angular-messages';
import 'angular-material';
import 'ng-redux';
import 'angular-gettext';
import ngFileUpload from 'ng-file-upload';

import { actions } from '../store/modules/cms';
import { reducers, middleware } from '../store/index';

import addNewContent from './AddNewContent/addNewContentComponent';
import commentWidget from './CommentWidget/commentWidgetComponent';
import detailElement from './DetailElement/detailElementComponent';
import listElement from './ListElement/listElementComponent';
import reportButton from './ReportDeleteButton/reportDeleteButtonComponent';
import planningAndGuidanceComponent from './PlanningAndGuidance/planningAndGuidanceComponent';
import trixComponent from '../Common/TrixComponent/trixComponent';

const moduleName = 'cms';

function config ($stateProvider, $locationProvider, $ngReduxProvider) {
  $stateProvider
    .state(moduleName,
      {
        url: '/:lng/cms',
        template: '<planning-and-guidance></planning-and-guidance>',
        resolve: {
          cms: ['$ngRedux', ($ngRedux) => {
            return $ngRedux.dispatch(actions.loadCmsData());
          }]
        }
      });
  $locationProvider.html5Mode(true);

  const reduxDevTools = window.__REDUX_DEVTOOLS_EXTENSION__;
  const storeExtension = reduxDevTools ? [reduxDevTools()] : undefined;
  $ngReduxProvider.createStoreWith(reducers, middleware, storeExtension);
}

config.$inject = ['$stateProvider', '$locationProvider', '$ngReduxProvider'];

export const cmsFactory = () => {
  angular.module('cms', [
    'ui.router',
    'ngMaterial',
    'ngMessages',
    'ngRedux',
    'gettext',
    ngSanitize,
    ngFileUpload
  ])
    .component(addNewContent.name, addNewContent)
    .component(commentWidget.name, commentWidget)
    .component(detailElement.name, detailElement)
    .component(listElement.name, listElement)
    .component(reportButton.name, reportButton)
    .component(planningAndGuidanceComponent.name, planningAndGuidanceComponent)
    .component(trixComponent.name, trixComponent)
    .config(config);

  const cmsjs = document.querySelector('#cmsjs');
  const uiView = document.createElement('ui-view');
  cmsjs.appendChild(uiView);

  angular.bootstrap(cmsjs, ['cms']);
};
