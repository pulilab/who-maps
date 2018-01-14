import angular from 'angular';
import ngFileUpload from 'ng-file-upload';
import Storage from './Storage';
import projectComponent from './ProjectComponent/projectComponent';
import searchBarComponent from './Searchbar/searchbarComponent';
import BadgeComponent from './Badge/badgeComponent';
import LoginComponent from './Login/loginComponent';
import ResetComponent from './Reset/resetComponent';
import SignupComponent from './Signup/signupComponent';
import AxisComponent from './Axis/axisComponent';
import viewersComponent from './Viewers/viewersComponent';
import followersComponent from './Followers/followersComponent';
import donorsComponent from './Donors/donorsComponent';
import EditProfileComponent from './EditProfile/editProfileComponent';
import countrymap from './CountryMap/countrymap.js';
import EmailConfirmationComponent from './EmailConfirmation/emailConfirmation';
import disclaimerComponent from './Disclaimer/disclaimerComponent.js';
import UUILoadComponent from './UUIDLoad/UUIDLoad';
import TermsOfUseComponent from './TermsOfUse/TermsOfUse';
import TopBarComponent from './TopBar/topBarComponent';
import SubBarComponent from './SubBar/subBarComponent';
import CountryTopBarComponent from './CountryTopBar/countryTopBarComponent';
import CountryPartners from './CountryPartners/countryPartnersComponent';
import OrganisationAutocomplete from './OrganisationAutocomplete/organisationComponent';
import TrixComponent from './TrixComponent/trixComponent';
import Thematic from './Thematic/thematicComponent';

import EE from './EE';

if (!window.EE) {
    EE.initialize();
}

const moduleName = 'Components';

angular.module(moduleName,
    [
        ngFileUpload
    ]
)
    .component(BadgeComponent.name, BadgeComponent)
    .component(projectComponent.name, projectComponent)
    .component(searchBarComponent.name, searchBarComponent)
    .component(LoginComponent.name, LoginComponent)
    .component(ResetComponent.name, ResetComponent)
    .component(SignupComponent.name, SignupComponent)
    .component(AxisComponent.name, AxisComponent)
    .component(viewersComponent.name, viewersComponent)
    .component(followersComponent.name, followersComponent)
    .component(donorsComponent.name, donorsComponent)
    .component(EditProfileComponent.name, EditProfileComponent)
    .component(countrymap.name, countrymap)
    .component(EmailConfirmationComponent.name, EmailConfirmationComponent)
    .component(disclaimerComponent.name, disclaimerComponent)
    .component(UUILoadComponent.name, UUILoadComponent)
    .component(TopBarComponent.name, TopBarComponent)
    .component(SubBarComponent.name, SubBarComponent)
    .component(CountryTopBarComponent.name, CountryTopBarComponent)
    .component(CountryPartners.name, CountryPartners)
    .component(OrganisationAutocomplete.name, OrganisationAutocomplete)
    .component(TrixComponent.name, TrixComponent)
    .component(Thematic.name, Thematic)
    .component(TermsOfUseComponent.name, TermsOfUseComponent);


export { EE };
export { Storage };
export { moduleName as Components };
