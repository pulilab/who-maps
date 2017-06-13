import angular from 'angular';
import newProjectComponent from './projectComponent';
import interoperability from './Interoperability/interoperabilityComponent';
import navigation from './Navigation/navigationComponent';
import generalOverview from './GeneralOverview/generalOverviewComponent';
import implementationOverview from './ImplementationOverview/implementationOverviewComponent';
import technology from './Technology/technologyComponent';
import countryFields from './CountryFields/countryFieldsComponent';
import dialogMultiSelection from './DialogMultiSelector/dialogMultiSelectorComponent';

const moduleName = 'Project';

angular.module(moduleName, [])
    .component(newProjectComponent.name, newProjectComponent)
    .component(interoperability.name, interoperability)
    .component(navigation.name, navigation)
    .component(generalOverview.name, generalOverview)
    .component(implementationOverview.name, implementationOverview)
    .component(countryFields.name, countryFields)
    .component(dialogMultiSelection.name, dialogMultiSelection)
    .component(technology.name, technology);


export default moduleName;
