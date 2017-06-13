import angular from 'angular';
import newProjectComponent from './projectComponent';
import interoperability from './Interoperability/interoperabilityComponent';
import navigation from './Navigation/navigationComponent';
import projectDetails from './GeneralOverview/generalOverviewComponent';
import strategy from './Strategy/strategyComponent';
import technology from './Technology/technologyComponent';
import countryFields from './CountryFields/countryFieldsComponent';
import dialogMultiSelection from './DialogMultiSelector/dialogMultiSelectorComponent';

const moduleName = 'Project';

angular.module(moduleName, [])
    .component(newProjectComponent.name, newProjectComponent)
    .component(interoperability.name, interoperability)
    .component(navigation.name, navigation)
    .component(projectDetails.name, projectDetails)
    .component(strategy.name, strategy)
    .component(countryFields.name, countryFields)
    .component(dialogMultiSelection.name, dialogMultiSelection)
    .component(technology.name, technology);


export default moduleName;
