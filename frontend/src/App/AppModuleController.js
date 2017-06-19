import _ from 'lodash';
import { Protected } from '../Common/';

class AppModuleController extends Protected {

    constructor($state, $scope, $rootScope, $mdToast) {
        super();
        this.EE = window.EE;
        this.state = $state;
        this.scope = $scope;
        this.dialog = $mdToast;
        this.rootScope = $rootScope;
        this.$onInit = this.onInit.bind(this);
    }

    onInit() {
        this.defaultOnInit();
        this.cs = require('../Common/CommonServices');
        this.watchers();
        this.eventBinding();
        this.projectId = this.state.params.appName;
        this.currentPage = this.state.current.name;
        this.showCountryTopBar = false;

        if (this.user) {
            this.fillUserData();
            this.userProfile = this.cs.userProfile;
            if (this.userProfile) {
                this.adjustUserType(this.userProfile);
            }
        }
        if (this.viewMode) {
            this.cs.getProjectData(this.projectId)
              .then(project => {
                  this.currentProject = project;
                  this.scope.$evalAsync();
              });
        }
        const profileNeeded = ['cms', 'editProject', 'newProject'];
        this.rootScope.$on('$stateChangeStart', (evt, toState) => {
            if (profileNeeded.indexOf(toState.name) > -1 && this.userProfile && !this.userProfile.name) {
                evt.preventDefault();
                this.showToast();
            }
        });
        this.rootScope.$on('$viewContentLoaded', () => {
            if (profileNeeded.indexOf(this.state.current.name) > -1
              && this.userProfile && !this.userProfile.name) {
                this.state.go('editProfile');
            }
        });
    }

    checkOwnership(state, cs) {
        const root = state.current.parent;
        const id = state.params.appName ? parseInt(state.params.appName, 10) : false;
        console.log(id);
        const isMemberOrViewer = cs.isMember({ id }) || cs.isViewer({ id });
        console.log(isMemberOrViewer);
        if (id !== false && !isMemberOrViewer && root === 'app') {
            state.go('public-dashboard', { appName: id });
        }
    }

    showToast() {
        this.dialog.show(
          this.dialog.simple()
            .textContent('You can\'t access this area without filling your profile')
            .position('bottom right')
            .hideDelay(3000)
        );
    }

    computeShowSubBar() {
        return !this.showCountryTopBar
          && this.user && this.user.projects
          && this.user.projects.length !== 0
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
        console.log(this.currentProject);
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

        function appController($state, $scope, $rootScope, $mdToast) {
            return new AppModuleController($state, $scope, $rootScope, $mdToast);
        }

        appController.$inject = ['$state', '$scope', '$rootScope', '$mdToast'];

        return appController;
    }

}

export default AppModuleController;
