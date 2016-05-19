import { trendingProjects } from './landingMock';
import { Storage } from '../Common/';

class LandingPageModuleController {

    constructor($scope, $location, $anchorScroll) {
        this.storage = new Storage();
        this.trendingProjects = trendingProjects;
        this.$location = $location;
        this.$anchorScroll = $anchorScroll;
        this.$onInit = this.onInit.bind(this);
        this.$onDestroy = this.onDestroy.bind(this);

    }

    onInit() {
        this.isLogin = this.storage.get('login');
        if (this.isLogin) {
            const commonService = require('../Common/CommonServices');
            this.projectList = commonService.projectList;
        }
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
