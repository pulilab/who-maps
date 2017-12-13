import * as SystemModule from '../store/modules/system';
import axios from '../plugins/axios';


class AppModuleController {

    constructor($state, $scope, $rootScope, $mdToast, $ngRedux, gettextCatalog) {
        this.EE = window.EE;
        this.state = $state;
        this.scope = $scope;
        this.dialog = $mdToast;
        this.rootScope = $rootScope;
        window.changeLanguage = async () => {
            const { data } = await axios.get('/static/t.json');
            console.log(data);
            gettextCatalog.setStrings('en', data.catalog);
            console.log(gettextCatalog);
        };
        this.$onInit = this.onInit.bind(this);
        this.$onDestroy = this.onDestroy.bind(this);
        this.unsubrscibe = $ngRedux.connect(this.mapState, SystemModule)(this);
    }

    mapState(state) {
        return {
            user: state.user,
            projects: state.projects
        };
    }

    onInit() {
        this.watchers();
        this.eventBinding();
        this.projectId = this.state.params.appName;
        this.currentPage = this.state.current.name;
        this.showCountryTopBar = false;
    }

    onDestroy()  {
        this.unsubrscibe();
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

    eventBinding() {
        this.EE.on('logout', this.handleLogoutEvent, this);
    }


    handleLogoutEvent() {
        this.systemLogout();
        const rest = this.cs.reset();
        rest.loadedPromise.then(() => {
            this.state.go('landing', { appName: null });
        });
    }

    static appControllerFactory() {

        function appController($state, $scope, $rootScope, $mdToast, $ngRedux, gettextCatalog) {
            return new AppModuleController($state, $scope, $rootScope, $mdToast, $ngRedux, gettextCatalog);
        }

        appController.$inject = ['$state', '$scope', '$rootScope', '$mdToast', '$ngRedux', 'gettextCatalog'];

        return appController;
    }

}

export default AppModuleController;
