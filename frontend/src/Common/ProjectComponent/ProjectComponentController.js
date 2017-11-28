class ProjectComponentController {

    constructor($state) {
        this.state = $state;
        this.$onInit = this.initialization.bind(this);
    }

    initialization() {
        if (!this.project) {
            this.project = {};
        }
    }

    cardClick() {
        if (!this.showDetails) {
            this.goToDashboard();
        }
    }

    goToDashboard() {
        this.state.go(this.member || this.viewer ? 'dashboard' : 'public-dashboard', { appName: this.project.id });
    }

    viewDraft() {
        this.state.go('editProject', { appName: this.project.id });
    }

    editDraft() {
        this.state.go('editProject', { appName: this.project.id });
    }

    viewPublished() {
        this.state.go('editProject', { appName: this.project.id, editMode: 'publish' });
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
