import angular from 'angular';
import uiRoute from 'angular-ui-router';
import { StaticUtilities } from '../Utilities';

import addNewContent from './AddNewContent/addNewContentComponent';
import commentWidget from './CommentWidget/commentWidgetComponent';
import dashboardWidget from './DashboardWidget/dashboardWidgetComponent';
import detailElement from './DetailElement/detailElementComponent';
import experiencesList from './ExperiencesList/experiencesListComponent';
import listElement from './ListElement/listElementComponent';
import staticInfoWidget from './StaticInfoWidget/staticInfoWidgetComponent';
import reportButton from './ReportDeleteButton/reportDeleteButtonComponent';

const moduleName = 'cms';
const su = new StaticUtilities('Cms');

function config($stateProvider, $compileProvider) {
    $stateProvider
      .state(moduleName,
        {
            url: '/cms',
            parent: 'app',
            views: {
                main: {
                    template: '<planning-and-guidance></planning-and-guidance>'
                }
            },
            resolve: {
                'main': () => {
                    return su.lazyLoader($compileProvider, 'PlanningAndGuidance/planningAndGuidanceComponent');
                }
            },
            profileRequired: true
        });
}

config.$inject = ['$stateProvider', '$compileProvider'];

angular.module(moduleName, [uiRoute])
  .component(addNewContent.name, addNewContent)
  .component(commentWidget.name, commentWidget)
  .component(dashboardWidget.name, dashboardWidget)
  .component(detailElement.name, detailElement)
  .component(experiencesList.name, experiencesList)
  .component(listElement.name, listElement)
  .component(reportButton.name, reportButton)
  .component(staticInfoWidget.name, staticInfoWidget)
  .config(config);

export default moduleName;
