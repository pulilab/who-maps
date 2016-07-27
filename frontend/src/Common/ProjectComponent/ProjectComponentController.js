class ProjectComponentController {

    constructor($state, CommonServices) {
        this.state = $state;
        this.cs = CommonServices;
        this.$onInit = this.initialization.bind(this);
    }

    initialization() {

        this.ownProject = this.member || this.viewer;

        if (!this.ngModel) {
            this.ngModel = {};
        }
        if (!this.ngModel.followersNr) {
            this.ngModel.followersNr = 0;
        }

        if (!this.ngModel.followersTrend) {
            this.ngModel.followersTrend = 'up';
        }
        if (this.ngModel.country
            && this.cs.projectStructure.countries
            && this.cs.projectStructure.countries[this.ngModel.country] ) {
            this.ngModel.countryName = this.cs.projectStructure.countries[this.ngModel.country].name;
        }
    }

    cardClick() {
        if (!this.showDetails) {
            this.goToDashboard();
        }
    }

    goToDashboard() {
        this.state.go(this.member || this.viewer ? 'dashboard' : 'public-dashboard', { appName: this.ngModel.id });
    }

    static projectComponentFactory() {
        require('./ProjectComponent.scss');
        function projectCp($state) {
            const CommonServices = require('../CommonServices');
            return new ProjectComponentController($state, CommonServices);
        }

        projectCp.$inject = ['$state'];

        return projectCp;
    }

}

export default ProjectComponentController;
