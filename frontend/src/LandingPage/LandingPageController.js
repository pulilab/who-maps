import { getSubDomain } from '../Utilities';
import * as ProjectModule from '../store/modules/projects';
import * as CountryModule from '../store/modules/countries';

class LandingPageModuleController {

    constructor($scope, $state, $location, $anchorScroll, $ngRedux) {
        this.scope = $scope;
        this.state = $state;
        this.EE = window.EE;
        this.$location = $location;
        this.$anchorScroll = $anchorScroll;
        this.$onInit = this.onInit.bind(this);
        this.$onDestroy = this.onDestroy.bind(this);
        this.unsubscribe = $ngRedux.connect(this.mapState, CountryModule)(this);
    }

    mapState(state) {
        return {
            user: state.user,
            projects: ProjectModule.getUserProjects(state),
            countryData: CountryModule.getCountryCoverPage(state),
            countryCover: CountryModule.getCountryCoverPicture(state)
        };
    }

    onInit() {
        const subDomain = getSubDomain();
        this.setCurrentCountryFromCode(subDomain);
    }

    onDestroy() {
        this.unsubscribe();
    }

    scrollTo(idString) {
        this.$location.hash(idString);
        this.$anchorScroll();
    }

    goToNewProject() {
        this.state.go('newProject');
    }

    static landingControllerFactory() {
        function landingController($scope, $state, $location, $anchorScroll, $ngRedux) {
            require('./landingPage.scss');
            return new LandingPageModuleController($scope, $state, $location, $anchorScroll, $ngRedux);
        }

        landingController.$inject = ['$scope', '$state', '$location', '$anchorScroll', '$ngRedux'];

        return landingController;
    }

}

export default LandingPageModuleController;
