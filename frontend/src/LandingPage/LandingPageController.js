import { Storage } from '../Common/';
import { CustomCountryService } from '../Common/';
import * as ProjectModule from '../store/modules/projects';
import * as UserModule from '../store/modules/user';

class LandingPageModuleController {

    constructor($scope, $location, $anchorScroll, $ngRedux) {
        this.storage = new Storage();
        this.ccs = CustomCountryService;
        this.scope = $scope;
        this.EE = window.EE;
        this.$location = $location;
        this.$anchorScroll = $anchorScroll;
        this.$onInit = this.onInit.bind(this);
        this.$onDestroy = this.onDestroy.bind(this);
        this.unsubscribeUsers = $ngRedux.connect(this.mapUsers, UserModule)(this);
        this.unsubscribeProjects = $ngRedux.connect(this.mapProjects, ProjectModule)(this);
    }

    mapUsers(state) {
        return {
            user: state.user
        };
    }

    mapProjects(state) {
        return {
            projects: ProjectModule.getPublishedProjects(state)
        };
    }

    onInit() {
        const vm = this;
        const subDomain = this.ccs.getSubDomain();
        this.ccs.getCountryData(subDomain).then(data => {
            vm.scope.$evalAsync(() => {
                vm.countryData = data;
                vm.countryCover = null;
                vm.countryData.partners = data.default_partners.concat(data.partner_logos);
                if (data.cover) {
                    vm.countryCover = {
                        background: `url(${data.cover}) 0 0`,
                        'background-size': 'cover',
                        'background-repeat': 'no-repeat'
                    };
                }
            });
        });
    }

    onDestroy() {
        this.unsubscribeUsers();
        this.unsubscribeProjects();
    }

    scrollTo(idString) {
        this.$location.hash(idString);
        this.$anchorScroll();
    }

    static landingControllerFactory() {
        function landingController($scope, $location, $anchorScroll, $ngRedux) {
            require('./landingPage.scss');
            return new LandingPageModuleController($scope, $location, $anchorScroll, $ngRedux);
        }

        landingController.$inject = ['$scope', '$location', '$anchorScroll', '$ngRedux'];

        return landingController;
    }

}

export default LandingPageModuleController;
