import _ from 'lodash';
import Protected  from '../Protected';
import Clipboard from 'clipboard';

class SubBarController extends Protected {

    constructor($state, $scope) {
        super();
        this.EE = window.EE;
        this.state = $state;
        this.scope = $scope;
        this.$onInit = this.onInit.bind(this);
    }

    onInit() {
        this.defaultOnInit();
        this.cs = require('../CommonServices');
        this.eventBinding();
        this.projectId = this.state.params.appName;
        this.currentPage = void 0;
        this.navigateToProject = this.navigateToProject.bind(this);
        this.iconFunction = this.iconFunction.bind(this);
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
                    this.createShareDefinition();
                    this.scope.$evalAsync();
                });
        }
        else if (this.currentProject) {
            this.createShareDefinition();
        }
    }

    eventBinding() {
        this.EE.on('projectListUpdated', this.fillUserData, this);
    }

    createShareDefinition() {
        this.shareUrl = {
            url: `http://${window.location.host}/project/${this.currentProject.public_id}`,
            copyClicked: false,
            clipboard: new Clipboard('.share-copy')
        };

        this.shareUrl.clipboard.on('success', event => {
            this.shareUrl.copyClicked = true;
            event.clearSelection();
        });
    }

    hasProfile() {
        return this.cs.hasProfile();
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

    navigateToProject(name) {
        const id = _.filter(this.user.projects, { name })[0].id;
        this.state.go(this.state.current.name, { 'appName': id });
    }

    fillUserData() {
        this.user = this.user || this.storage.get('user');
        this.user.projects = this.cs.projectList;
        const lastProject = _.last(this.user.projects);
        this.cs.addMember(lastProject);

        if (this.state.params && this.state.params.appName
            && this.state.params.appName.length === 0
            && lastProject && lastProject.id) {
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


    openMenu($mdOpenMenu, event) {
        $mdOpenMenu(event);
    }

    static subBarControllerFactory() {
        require('./subBar.scss');
        function subBarController($state, $scope) {
            return new SubBarController($state, $scope);
        }

        subBarController.$inject = ['$state', '$scope'];

        return subBarController;
    }

}

export default SubBarController;
