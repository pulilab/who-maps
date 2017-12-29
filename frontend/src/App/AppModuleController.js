import * as SystemModule from '../store/modules/system';

class AppModuleController {

    constructor($state, $scope, $rootScope, $mdToast, $ngRedux) {
        this.state = $state;
        this.scope = $scope;
        this.dialog = $mdToast;
        this.rootScope = $rootScope;
        this.$onInit = this.onInit.bind(this);
        this.$onDestroy = this.onDestroy.bind(this);
        this.unsubscribe = $ngRedux.connect(this.mapState, SystemModule)(this);
    }

    mapState(state) {
        return {
            user: state.user,
            projects: state.projects
        };
    }

    onInit() {
        this.watchers();
        this.projectId = this.state.params.appName;
        this.currentPage = this.state.current.name;
        this.showCountryTopBar = false;
    }

    onDestroy()  {
        this.unsubscribe();
    }

    computeShowSubBar() {
        return !this.showCountryTopBar
          && this.user && this.projects
          && this.projects.length !== 0
          && this.state.current.name !== 'newProject';
    }

    watchers() {
        this.scope.$watch(() => {
            return this.state.current.name;
        }, value => {
            this.currentPage = value;
            this.showSubBar = this.computeShowSubBar();
        });
    }

    static appControllerFactory() {

        function appController($state, $scope, $rootScope, $mdToast, $ngRedux) {
            return new AppModuleController($state, $scope, $rootScope, $mdToast, $ngRedux);
        }

        appController.$inject = ['$state', '$scope', '$rootScope', '$mdToast', '$ngRedux'];

        return appController;
    }

}

export default AppModuleController;
