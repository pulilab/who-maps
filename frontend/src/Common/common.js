import angular from 'angular';
import ngFileUpload from 'ng-file-upload';


import EE from './EE';

if (! window.EE) {
    EE.initialize();
}


import AuthApi from './AuthApi';
import SimpleApi from './SimpleApi';
import Storage from './Storage';
import Protected from './Protected';
import IntroJs from './IntroJs/introJsComponent';
import CommonServices from './CommonServices';
import SearchableSelectionMenu from './SearchableSelectionMenu/searchableSelectionMenuComponent';
import projectComponent from './ProjectComponent/projectComponent';
import searchBarComponent from './Searchbar/searchbarComponent';
import BadgeComponent from './Badge/badgeComponent';
import LoginComponent from './Login/loginComponent';
import ResetComponent from './Reset/resetComponent';
import SignupComponent from './Signup/signupComponent';
import AxisComponent from './Axis/axisComponent';
import NewProjectComponent from './NewProject/newProjectComponent';
import viewersComponent from './Viewers/viewersComponent';
import followersComponent from './Followers/followersComponent';
import donorsComponent from './Donors/donorsComponent';
import EditProfileComponent from './EditProfile/editProfileComponent';
import countrymap from './CountryMap/countrymap.js';
import EmailConfirmationComponent from './EmailConfirmation/emailConfirmation';
import disclaimerComponent from './Disclaimer/disclaimerComponent.js';
import RefreshProjectComponent from './RefreshProject/refreshProject';
import UUILoadComponent from './UUIDLoad/UUIDLoad';
import TermsOfUseComponent from './TermsOfUse/TermsOfUse';
import TopBarComponent from './TopBar/topBarComponent';
import SubBarComponent from './SubBar/subBarComponent';
import CountryTopBarComponent from './CountryTopBar/countryTopBarComponent';

const moduleName = 'Components';

angular.module(moduleName,
    [
        ngFileUpload
    ]
)
    .component(IntroJs.name, IntroJs)
    .component(SearchableSelectionMenu.name, SearchableSelectionMenu)
    .component(BadgeComponent.name, BadgeComponent)
    .component(projectComponent.name, projectComponent)
    .component(searchBarComponent.name, searchBarComponent)
    .component(LoginComponent.name, LoginComponent)
    .component(ResetComponent.name, ResetComponent)
    .component(SignupComponent.name, SignupComponent)
    .component(AxisComponent.name, AxisComponent)
    .component(NewProjectComponent.name, NewProjectComponent)
    .component(viewersComponent.name, viewersComponent)
    .component(followersComponent.name, followersComponent)
    .component(donorsComponent.name, donorsComponent)
    .component(EditProfileComponent.name, EditProfileComponent)
    .component(countrymap.name, countrymap)
    .component(EmailConfirmationComponent.name, EmailConfirmationComponent)
    .component(disclaimerComponent.name, disclaimerComponent)
    .component(RefreshProjectComponent.name, RefreshProjectComponent)
    .component(UUILoadComponent.name, UUILoadComponent)
    .component(TopBarComponent.name, TopBarComponent)
    .component(SubBarComponent.name, SubBarComponent)
    .component(CountryTopBarComponent.name, CountryTopBarComponent)
    .component(TermsOfUseComponent.name, TermsOfUseComponent);


export { EE };
export { AuthApi };
export { Storage };
export { SimpleApi };
export { Protected };
export { CommonServices };
export { moduleName as Components };
