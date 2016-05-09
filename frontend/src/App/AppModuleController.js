import _ from 'lodash';
import { Protected } from '../Common/';
import { CommonService } from '../Common';

class AppModuleController extends Protected {

    constructor($state, $scope) {
        super();
        this.EE = window.EE;
        this.state = $state;
        this.scope = $scope;
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
        if (this.isLogin) {
            this.fillUserData();
        }

        this.notifications = [1, 2, 3];

        this.scope.$watch(() => {
            return this.state.current.name;
        }, value => {
            this.currentPage = value;
            this.showCompleteNavigation(value, this.isLogin);
        });

        this.lastProjectEvent = void 0;


        this.EE.on('login', this.handleLoginEvent.bind(this));
        this.EE.on('unauthorized', this.handleUnauthorized.bind(this));
        this.EE.on('logout', this.handleLogout.bind(this));
        this.EE.on('projectListUpdated', this.fillUserData.bind(this));
        this.EE.on('refreshProjects', this.refreshProjectsHandler.bind(this));
        this.EE.on('doDigest', this.doDigest.bind(this));
    }

    refreshProjectsHandler() {
        if (this.lastProjectEvent === 'projectListUpdated') {
            this.goToDashboard();
        }
        else {
            this.lastProjectEvent = 'refreshProjects';
        }
    }


    doDigest() {
        this.scope.$evalAsync();
    }

    handleLoginEvent(forced) {
        if (forced) {
            console.log('some forced action');
        }
        this.systemLogin();
        this.fillUserData();
        this.state.go('dashboard');
    }

    updateProject(name) {
        const id = _.filter(this.user.projects, { name })[0].id;
        this.state.go(this.state.current.name, { 'appName': id });
    }

    fillUserData() {
        this.user.projects = CommonService.projectList;
        if (this.state.params.appName.length === 0) {
            const state = this.state.current.name === 'login' ? 'dashboard' : this.state.current.name;
            this.state.go(state, { 'appName': this.user.projects[0].id });
        }
        _.forEach(this.user.projects, item => {
            if (item.id === parseInt(this.state.params.appName, 10)) {
                this.currentProject = item;
            }
        });

        this.scope.$evalAsync();

        if (this.lastProjectEvent === 'refreshProjects') {
            this.goToDashboard();
        }
        else {
            this.lastProjectEvent = 'projectListUpdated';
        }

    }

    goToDashboard() {
        this.state.go('dashboard', { 'appName': _.last(this.user.projects).id });
    }

    handleUnauthorized() {
        this.logout();
    }

    handleLogout() {
        this.state.go('login', { projectId: null });
    }

    showCompleteNavigation(state, isLogin) {
        const isLanding = state === 'landing' || state === 'newProject';
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
