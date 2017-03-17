import { Storage } from '../Common/';
import SignupService from '../Common/Signup/SignupService';
import { CustomCountryService } from '../Common/';

class LandingPageModuleController {

    constructor($scope, $location, $anchorScroll) {
        this.storage = new Storage();
        this.ss = new SignupService();
        this.ccs = CustomCountryService;
        this.scope = $scope;
        this.EE = window.EE;
        this.$location = $location;
        this.$anchorScroll = $anchorScroll;
        this.$onInit = this.onInit.bind(this);
        this.$onDestroy = this.onDestroy.bind(this);

    }

    onInit() {
        const vm = this;
        this.isLogin = this.storage.get('login');
        if (this.isLogin) {
            const commonService = require('../Common/CommonServices');
            this.projectList = commonService.projectList;
        }
        const subDomain = this.ccs.getSubDomain();
        this.ccs.getCountryData(subDomain).then(data => {
            vm.scope.$evalAsync(() => {
                vm.countryData = data;
                vm.countryCover = {
                    background: `url(${data.cover}) 0 0`,
                    'background-size': 'cover',
                    'background-repeat': 'no-repeat'
                };
            });
        });
    }

    onDestroy() {
        this.isLogin = void 0;
    }

    scrollTo(idString) {
        this.$location.hash(idString);
        this.$anchorScroll();
    }

    static landingControllerFactory() {
        function landingController($scope, $location, $anchorScroll) {
            require('./landingPage.scss');
            return new LandingPageModuleController($scope, $location, $anchorScroll);
        }

        landingController.$inject = ['$scope', '$location', '$anchorScroll'];

        return landingController;
    }

}

export default LandingPageModuleController;
