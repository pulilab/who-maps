import angular from 'angular';
import newProjectComponent from './projectComponent';
import additionalInfo from './AdditionalInfo/additionalInfoComponent';
import interoperability from './Interoperability/interoperabilityComponent';
import navigation from './Navigation/navigationComponent';
import projectDetails from './ProjectDetails/projectDetailsComponent';
import strategy from './Strategy/strategyComponent';
import technology from './Technology/technologyComponent';

const moduleName = 'Project';

angular.module(moduleName, [])
    .component(newProjectComponent.name, newProjectComponent)
    .component(additionalInfo.name, additionalInfo)
    .component(interoperability.name, interoperability)
    .component(navigation.name, navigation)
    .component(projectDetails.name, projectDetails)
    .component(strategy.name, strategy)
    .component(technology.name, technology);


export { moduleName as Project };
