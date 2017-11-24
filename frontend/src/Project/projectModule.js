import angular from 'angular';
import newProjectComponent from './projectComponent';
import interoperability from './Interoperability/interoperabilityComponent';
import navigation from './Navigation/navigationComponent';
import generalOverview from './GeneralOverview/generalOverviewComponent';
import implementationOverview from './ImplementationOverview/implementationOverviewComponent';
import technology from './Technology/technologyComponent';
import countryFields from './CountryFields/countryFieldsComponent';
import dialogMultiSelection from './DialogMultiSelector/dialogMultiSelectorComponent';
import * as ProjectsModule from '../store/modules/projects';

const moduleName = 'Project';


function config($stateProvider) {
    $stateProvider.state('newProject', {
        url: '/new-project/:editMode/',
        parent: 'app',
        views: {
            main: {
                template: '<project layout-fill layout="column" ></project>'
            }
        },
        resolve: {
            user: ['$ngRedux', ($ngRedux) => {
                return $ngRedux.dispatch(ProjectsModule.loadProjectStructure());
            }]
        },
        params: {
            editMode: 'draft'
        },
        profileRequired: true
    })
      .state('editProject', {
          url: '/edit-project/:editMode/',
          parent: 'app',
          params: {
              editMode: 'draft'
          },
          views: {
              main: {
                  template: '<project edit-mode="true" layout-fill layout="column" ></project>'
              }
          },
          resolve: {
              user: ['$ngRedux', ($ngRedux) => {
                  return $ngRedux.dispatch(ProjectsModule.loadProjectStructure());
              }]
          },
          profileRequired: true
      });
}


config.$inject = ['$stateProvider'];

angular.module(moduleName, [])
  .component(newProjectComponent.name, newProjectComponent)
  .component(interoperability.name, interoperability)
  .component(navigation.name, navigation)
  .component(generalOverview.name, generalOverview)
  .component(implementationOverview.name, implementationOverview)
  .component(countryFields.name, countryFields)
  .component(dialogMultiSelection.name, dialogMultiSelection)
  .component(technology.name, technology)
  .config(config);


export default moduleName;
