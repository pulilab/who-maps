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
        this.currentPage = void 0;
        this.showFullNavigation = false;
        this.updateProject = this.updateProject.bind(this);
        this.currentProjectMock = {
            contact: {
                name: 'Jane M Doe',
                email: 'po@kungFu.panda'
            }
        };
        if (this.user) {
            this.fillUserData();
            this.userProfile = this.cs.userProfile;
            if (this.userProfile) {
                this.adjustUserType(this.userProfile);
            }
        }

        this.notifications = [1, 2, 3];

        if (this.viewMode) {
            this.cs.getProjectData(this.projectId)
                .then(project => {
                    this.currentProject = project;
                    this.scope.$evalAsync();
                });
        }
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
        this.EE.on('unauthorized', this.handleUnauthorized, this);
        this.EE.on('logout', this.handleLogoutEvent, this);
        this.EE.on('projectListUpdated', this.fillUserData, this);
        this.EE.on('refreshProjects', this.refreshProjectsHandler, this);
    }

    checkUserProfile() {
        if (!this.userProfile && this.isLogin) {
            this.state.go('editProfile');
        }
    }

    refreshProjectsHandler() {
        this.cs.reset().loadedPromise.then(() => {
            this.fillUserData();
        });
    }

    updateProject(name) {
        const id = _.filter(this.user.projects, { name })[0].id;
        this.state.go(this.state.current.name, { 'appName': id });
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

    }

    goToDashboard() {
        this.state.go('dashboard', { 'appName': _.last(this.user.projects).id });
    }

    goToEditProject() {
        this.state.go('editProject', { 'appName': _.last(this.user.projects).id });
    }

    handleUnauthorized() {
        this.logout();
    }

    handleLogoutEvent() {
        this.state.go('landing', { appName: null });

    }

    showCompleteNavigation(state, isLogin) {
        const isLanding = state === 'landing-logged' || state === 'newProject';
        this.showFullNavigation = (!isLanding && isLogin) || this.viewMode;
    }


    openMenu($mdOpenMenu, event) {
        $mdOpenMenu(event);
    }

    logout() {
        this.systemLogout();
        const rest = this.cs.reset();
        rest.loadedPromise.then(() => {
            this.showCompleteNavigation(null, false);
        });
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
