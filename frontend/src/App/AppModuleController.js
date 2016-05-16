import _ from 'lodash';
import { Protected } from '../Common/';

class AppModuleController extends Protected {

    constructor($state, $scope) {
        super();
        this.EE = window.EE;
        this.state = $state;
        this.scope = $scope;
        this.cs = require('../Common/CommonServices').default;
        this.userProfile = this.cs.userProfile;
        this.currentPage = void 0;
        this.showFullNavigation = false;
        this.updateProject = this.updateProject.bind(this);
        this.currentProjectMock = {
            version: {
                id: '3',
                date: '12 Feb, 2016'
            },
            contact: {
                name: 'Jane M Doe',
                email: 'po@kungFu.panda'
            }
        };
        if (this.user) {
            this.fillUserData();
        }

        this.notifications = [1, 2, 3];

        this.scope.$watch(() => {
            return this.state.current.name;
        }, value => {
            this.currentPage = value;
            this.showCompleteNavigation(value, this.isLogin);
            this.checkUserProfile();
        });
        this.EE.on('unauthorized', this.handleUnauthorized.bind(this));
        this.EE.on('logout', this.handleLogout.bind(this));
        this.EE.on('projectListUpdated', this.fillUserData.bind(this));
        this.EE.on('refreshProjects', this.refreshProjectsHandler.bind(this));
    }

    checkUserProfile() {
        if (!this.userProfile) {
            this.state.go('editProfile');
        }
    }

    refreshProjectsHandler() {
        this.cs.reset().loadedPromise.then(() => {
            this.fillUserData();
            this.goToDashboard();
        });
    }

    updateProject(name) {
        const id = _.filter(this.user.projects, { name })[0].id;
        this.state.go(this.state.current.name, { 'appName': id });
    }

    fillUserData() {
        this.user.projects = this.cs.projectList;
        const lastProject = _.last(this.user.projects);

        if (!lastProject || !lastProject.id) {
            this.state.go('country');
        }

        if (this.state.params.appName.length === 0 && lastProject && lastProject.id) {
            const appName = lastProject.id;
            const state = this.state.current.name === 'app' ? 'dashboard' : this.state.current.name;
            this.state.go(state, { appName });
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

    handleUnauthorized() {
        this.logout();
    }

    handleLogout() {
        this.state.go('login', { appName: null });
    }

    showCompleteNavigation(state, isLogin) {
        const isLanding = state === 'landing-logged' || state === 'newProject';
        this.showFullNavigation = !isLanding && isLogin;
    }


    openMenu($mdOpenMenu, event) {
        $mdOpenMenu(event);
    }

    logout() {
        this.systemLogout();
        this.showCompleteNavigation(null, false);
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
