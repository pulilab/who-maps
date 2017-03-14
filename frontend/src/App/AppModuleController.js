import _ from 'lodash';
import { Protected } from '../Common/';

class AppModuleController extends Protected {

    constructor($state, $scope) {
        super();
        this.EE = window.EE;
        this.state = $state;
        this.scope = $scope;
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
        this.showFullNavigation = false;
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
    }

    showSubBar() {
        return this.showCountryTopBar && this.user.projects.length !== 0;
    }

    watchers() {
        this.scope.$watch(() => {
            return this.state.current.name;
        }, value => {
            this.currentPage = value;
            this.showCompleteNavigation(value, this.isLogin);
            this.checkUserProfile();
        });
    }

    eventBinding() {
        this.EE.on('unauthorized', this.handleLogoutEvent, this);
        this.EE.on('logout', this.handleLogoutEvent, this);
        this.EE.on('projectListUpdated', this.fillUserData, this);
    }

    checkUserProfile() {
        if (!this.userProfile && this.isLogin) {
            this.state.go('editProfile');
        }
    }

    fillUserData(forcedPath) {
        this.user.projects = this.cs.projectList;
        const lastProject = _.last(this.user.projects);

        if (!forcedPath && this.state.params.appName.length === 0 && lastProject && lastProject.id) {
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


        if (forcedPath) {
            this.state.go(forcedPath.go, { appName: forcedPath.appName }, {
                location: 'replace',
                reload: true
            });
        }

        this.scope.$evalAsync();

    }

    handleLogoutEvent() {
        this.systemLogout();
        const rest = this.cs.reset();
        rest.loadedPromise.then(() => {
            this.showCompleteNavigation(null, false);
            this.state.go('landing', { appName: null });
        });
    }

    showCompleteNavigation(state, isLogin) {
        const isLandingOrNewProject = state === 'landing-logged' || state === 'newProject';
        this.showFullNavigation = (!isLandingOrNewProject && isLogin) || this.viewMode;
    }

    static appControllerFactory() {

        function appController($state, $scope) {
            return new AppModuleController($state, $scope);
        }

        appController.$inject = ['$state', '$scope'];

        return appController;
    }

}

export default AppModuleController;
