import angular from 'angular';

import EE from './EE';
import AuthApi from './AuthApi';
import SimpleApi from './SimpleApi';
import Storage from './Storage';
import Protected from './Protected';
import IntroJs from './IntroJs/introJsComponent';
import SearchableSelectionMenu from './SearchableSelectionMenu/searchableSelectionMenuComponent';
import projectComponent from './ProjectComponent/projectComponent';
import searchbarComponent from './Searchbar/searchbar';
import BadgeComponent from './Badge/badgeComponent';
import LoginComponent from './Login/LoginComponent';
import SignupComponent from './Signup/SignupComponent';

const moduleName = 'Components';

angular.module(moduleName, [])
    .component(IntroJs.name, IntroJs)
    .component(SearchableSelectionMenu.name, SearchableSelectionMenu)
    .component(BadgeComponent.name, BadgeComponent)
    .component(projectComponent.name, projectComponent)
    .component(searchbarComponent.name, searchbarComponent)
    .component(LoginComponent.name, LoginComponent)
    .component(SignupComponent.name, SignupComponent);


export { EE };
export { AuthApi };
export { Storage };
export { SimpleApi };
export { Protected };
export { moduleName as Components };
