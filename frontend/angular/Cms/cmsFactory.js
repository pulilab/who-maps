import angular from 'angular';
import 'angular-ui-router';
import 'angular-messages';
import 'angular-material';
import 'ng-redux';
import 'angular-gettext';
import ngFileUpload from 'ng-file-upload';

// import * as SystemModule from '../store/modules/system';
import * as CmsModule from '../store/modules/cms';
import { reducers, middleware } from '../store/index';

import addNewContent from './AddNewContent/addNewContentComponent';
// import commentWidget from './CommentWidget/commentWidgetComponent';
// import dashboardWidget from './DashboardWidget/dashboardWidgetComponent';
// import detailElement from './DetailElement/detailElementComponent';
// import experiencesList from './ExperiencesList/experiencesListComponent';
// import listElement from './ListElement/listElementComponent';
// import staticInfoWidget from './StaticInfoWidget/staticInfoWidgetComponent';
// import reportButton from './ReportDeleteButton/reportDeleteButtonComponent';
import planningAndGuidanceComponent from './PlanningAndGuidance/planningAndGuidanceComponent';

const moduleName = 'cms';

function config ($stateProvider, $locationProvider, $ngReduxProvider) {
  $stateProvider
    .state(moduleName,
      {
        url: '/cms',
        // views: {
        // main: {
        //     template: '<planning-and-guidance></planning-and-guidance>'
        //   }
        // },
        template: '<planning-and-guidance></planning-and-guidance>',
        resolve: {
          system: ['$ngRedux', ($ngRedux) => {
            // return $ngRedux.dispatch(SystemModule.loadUserProfiles());
          }],
          cms: ['$ngRedux', ($ngRedux) => {
            return $ngRedux.dispatch(CmsModule.loadCmsData());
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
    ngFileUpload
  ])
    .component(addNewContent.name, addNewContent)
    // .component(commentWidget.name, commentWidget)
    // .component(dashboardWidget.name, dashboardWidget)
    // .component(detailElement.name, detailElement)
    // .component(experiencesList.name, experiencesList)
    // .component(listElement.name, listElement)
    // .component(reportButton.name, reportButton)
    // .component(staticInfoWidget.name, staticInfoWidget)
    .component(planningAndGuidanceComponent.name, planningAndGuidanceComponent)
    .config(config);

  const cmsjs = document.querySelector('#cmsjs');
  const uiView = document.createElement('ui-view');
  cmsjs.appendChild(uiView);

  angular.bootstrap(cmsjs, ['cms']);
};
