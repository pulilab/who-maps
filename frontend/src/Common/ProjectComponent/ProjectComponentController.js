class ProjectComponentController {

    constructor() {
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

    static projectComponentFactory() {
        require('./ProjectComponent.scss');
        function projectCp($element) {
            return new ProjectComponentController($element);
        }

        projectCp.$inject = [];

        return projectCp;
    }

}

export default ProjectComponentController;
