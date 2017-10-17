import _ from 'lodash';
import * as SystemModule from '../store/modules/system';


class AppModuleController {

    constructor($state, $scope, $rootScope, $mdToast, $ngRedux) {
        this.EE = window.EE;
        this.state = $state;
        this.scope = $scope;
        this.dialog = $mdToast;
        this.rootScope = $rootScope;
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
        this.cs = require('../Common/CommonServices');
        this.watchers();
        this.eventBinding();
        this.projectId = this.state.params.appName;
        this.currentPage = this.state.current.name;
        this.showCountryTopBar = false;

        if (this.viewMode) {
            this.cs.getProjectData(this.projectId)
              .then(project => {
                  this.currentProject = project;
                  this.scope.$evalAsync();
              });
        }
    }

    onDestroy()  {
        this.unsubrscibe();
    }

    checkOwnership(state, cs) {
        const root = state.current.parent;
        const id = state.params.appName ? parseInt(state.params.appName, 10) : false;
        const isMemberOrViewer = cs.isMember({ id }) || cs.isViewer({ id });
        if (id !== false && !isMemberOrViewer && root === 'app') {
            state.go('public-dashboard', { appName: id });
        }
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
            // this.fillUserData();
            this.showSubBar = this.computeShowSubBar();
        });
    }

    eventBinding() {
        this.EE.on('logout', this.handleLogoutEvent, this);
    }

    fillUserData() {
        this.user.projects = this.cs.projectList;
        const lastProject = _.last(this.user.projects);

        if (this.state.params.appName.length === 0 && lastProject && lastProject.id) {
            const appName = lastProject.id;
            const state = this.state.current.name === 'app' ? 'dashboard' : this.state.current.name;
            this.state.go(state, { appName }, {
                location: 'replace'
            });
        }
        _.forEach(this.user.projects, item => {
            if (item.id === parseInt(this.state.params.appName, 10)) {
                this.currentProject = item;
            }
        });
        this.scope.$evalAsync();
        this.checkOwnership(this.state, this.cs);

    }

    handleLogoutEvent() {
        this.systemLogout();
        const rest = this.cs.reset();
        rest.loadedPromise.then(() => {
            this.state.go('landing', { appName: null });
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
