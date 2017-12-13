import * as LanguageModule from '../../store/modules/language';

class ProjectComponentController {

    constructor($state, $ngRedux) {
        this.state = $state;
        this.$ngRedux = $ngRedux;
        this.$onInit = this.onInit.bind(this);
        this.$onDestroy = this.ondDestroy.bind(this);
        this.mapState = this.mapState.bind(this);
    }

    mapState(state) {
        this.translate = LanguageModule.translate.bind(this, state);
        return {};
    }

    onInit() {
        this.unsubscribe = this.$ngRedux.connect(this.mapState, null)(this);
        if (!this.project) {
            this.project = {};
        }
    }

    ondDestroy() {
        this.unsubscribe();
    }

    cardClick() {
        if (!this.showDetails) {
            this.goToDashboard();
        }
    }

    goToDashboard() {
        this.state.go(this.project.isMember || this.project.isViewer ?
          'dashboard' : 'public-dashboard', { appName: this.project.id });
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
        function projectCp($state, $ngRedux) {
            return new ProjectComponentController($state, $ngRedux);
        }

        projectCp.$inject = ['$state', '$ngRedux'];

        return projectCp;
    }

}

export default ProjectComponentController;
