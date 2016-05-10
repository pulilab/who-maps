class ProjectComponentController {

    constructor($state) {
        this.state = $state;
        this.$onInit = this.initialization.bind(this);
    }

    initialization() {
        if (!this.ngModel) {
            this.ngModel = {};
        }
        if (!this.ngModel.followersNr) {
            this.ngModel.followersNr = 0;
        }

        if (!this.ngModel.followersTrend) {
            this.ngModel.followersTrend = 'up';
        }

        if (this.ngModel.countryName) {
            this.ngModel.countryName.replace('-', ' ');
        }
    }
    showPointer() {
        return !this.showDetails && this.ownProject;
    }

    cardClick() {
        if (this.showPointer()) {
            this.state.go('dashboard', { appName: this.ngModel.id });
        }
    }

    static projectComponentFactory() {
        require('./ProjectComponent.scss');
        function projectCp($state) {
            return new ProjectComponentController($state);
        }

        projectCp.$inject = ['$state'];

        return projectCp;
    }

}

export default ProjectComponentController;
