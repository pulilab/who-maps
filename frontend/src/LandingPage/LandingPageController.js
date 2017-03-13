import { Storage } from '../Common/';
import SignupService from '../Common/Signup/SignupService';
import LandingPageService from './landingPageService';

class LandingPageModuleController {

    constructor($scope, $location, $anchorScroll) {
        this.storage = new Storage();
        this.ss = new SignupService();
        this.lps = new LandingPageService();
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
        const hostArray = window.location.host.split('.');
        const subDomain = hostArray.length > 1 ? hostArray.shift() : 'who';
        this.lps.getCountryData(subDomain).then(data => {
            console.log(data);
            vm.countryData = data;
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
