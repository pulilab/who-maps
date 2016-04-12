import angular from 'angular';

import EE from './EE';
import AuthApi from './AuthApi';
import SessionStorage from './Storage';
import IntroJs from './IntroJs/introJsComponent';
import SearchableSelectionMenu from './SearchableSelectionMenu/searchableSelectionMenuComponent';
import projectComponent from './ProjectComponent/projectComponent';
import searchbarComponent from './Searchbar/searchbar';
import BadgeComponent from './Badge/badgeComponent';

const moduleName = 'Components';

angular.module(moduleName, [])
    .component(IntroJs.name, IntroJs)
    .component(SearchableSelectionMenu.name, SearchableSelectionMenu)
    .component(BadgeComponent.name, BadgeComponent)
    .component(projectComponent.name, projectComponent)
    .component(searchbarComponent.name, searchbarComponent);


export { EE };
export { AuthApi };
export { SessionStorage };

export { moduleName as Components };
