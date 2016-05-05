import { trendingProjects } from './landingMock';

class LandingPageModuleController {

    constructor($scope, $location, $anchorScroll) {
        this.trendingProjects = trendingProjects;
        this.$location = $location;
        this.$anchorScroll = $anchorScroll;
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
