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
        this.iconFunction = this.iconFunction.bind(this);

        if (this.user) {
            this.fillUserData();
            this.userProfile = this.cs.userProfile;
            console.log(this.userProfile)
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
        this.EE.on('profileUpdated', this.refreshProfileInfo, this);
    }

    iconFunction(item) {
        const base = {
            name: 'visibility',
            style: {
                color: '#53A0CE',
                position: 'absolute',
                right: '5px',
                fontSize: '15px',
                lineHeight: '24px'
            }
        };
        if (this.userProfile.member.indexOf(item.id) > -1) {
            base.name = 'grade';
            base.style.color = '#CD9924';
        }
        return base;
    }

    writeUserRole() {
        let type = null;
        switch (this.userProfile.account_type) {
        case 'I':
            type = 'Implementer';
            break;
        case 'G':
            type = 'Financial Investor';
            break;
        case 'D':
            type = 'Government';
            break;
        }
        return type;
    }

    refreshProfileInfo() {
        this.userProfile = this.cs.userProfile;
        this.scope.$evalAsync();
        if (this.cs.projectList > 0) {
            this.state.go('dashboard');
        }
        else {
            this.state.go('country');
        }
    }

    checkUserProfile() {
        if (!this.userProfile && this.isLogin) {
            this.state.go('editProfile');
        }
    }

    refreshProjectsHandler(data) {
        this.cs.reset().loadedPromise.then(() => {
            this.fillUserData(data);
        });
    }

    updateProject(name) {
        const id = _.filter(this.user.projects, { name })[0].id;
        this.state.go(this.state.current.name, { 'appName': id });
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
                location: 'replace'
            });
        }

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
            this.handleLogoutEvent();
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
