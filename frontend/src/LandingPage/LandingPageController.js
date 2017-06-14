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
        this.addEventListeners = this.addEventListeners.bind(this);
        this.removeEventListeners = this.removeEventListeners.bind(this);
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
                vm.countryCover = null;
                vm.countryData.partners = data.default_partners.concat(data.partner_logos);
                if (data.cover) {
                    vm.countryCover = {
                        background: `url(${data.cover}) 0 0`,
                        'background-size': 'cover',
                        'background-repeat': 'no-repeat'
                    };
                }
                vm.showFooter = data.footer_text && data.footer_title;
            });
        });
        this.addEventListeners();
    }

    onDestroy() {
        this.isLogin = void 0;
        this.removeEventListeners();
    }

    addEventListeners() {
        this.EE.on('logout', this.handleLogout, this);
    }

    handleLogout() {
        this.scope.$evalAsync(() => {
            this.isLogin = false;
        });
    }

    removeEventListeners() {
        this.EE.removeListener('logout', this.handleLogout, this);
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
