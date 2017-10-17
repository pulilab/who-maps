import _ from 'lodash';
import Clipboard from 'clipboard';
import * as ProjectModule from '../../store/modules/projects';

class SubBarController {

    constructor($state, $scope, $ngRedux) {
        this.EE = window.EE;
        this.state = $state;
        this.scope = $scope;
        this.$onInit = this.onInit.bind(this);
        this.$onDestroy = this.onDestroy.bind(this);
        this.unsubscribe = $ngRedux.connect(this.mapState, ProjectModule)(this);
    }

    mapState(state) {
        return {
            projects: state.projects,
            userProfile: state.user.profile
        };
    }

    onInit() {
        this.cs = require('../CommonServices');
        this.eventBinding();
        this.projectId = this.state.params.appName;
        this.currentPage = void 0;
        this.navigateToProject = this.navigateToProject.bind(this);
        this.iconFunction = this.iconFunction.bind(this);
        if (this.viewMode) {
            this.cs.getProjectData(this.projectId)
              .then(project => {
                  this.currentProject = project;
                  this.createShareDefinition();
                  this.scope.$evalAsync();
              });
        }

        this.projects.forEach(item => {
            if (item.id === parseInt(this.state.params.appName, 10)) {
                this.currentProject = item;
            }
        });

        if (this.currentProject) {
            this.createShareDefinition();
        }
    }

    onDestroy() {
        this.unsubscribe();
    }

    eventBinding() {
        this.EE.on('projectListUpdated', this.getProjectsData, this);
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
        return  this.userProfile && this.userProfile.country;
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
        const id = _.filter(this.projects, { name })[0].id;
        this.state.go(this.state.current.name, { 'appName': id });
    }

    getProjectsData() {
        const lastProject = _.last(this.projects);

        if (this.state.params && this.state.params.appName
          && this.state.params.appName.length === 0
          && lastProject && lastProject.id) {
            const appName = lastProject.id;
            const state = this.state.current.name === 'app' ? 'dashboard' : this.state.current.name;
            this.state.go(state, { appName }, {
                location: 'replace'
            });
        }
        _.forEach(this.projects, item => {
            if (item.id === parseInt(this.state.params.appName, 10)) {
                this.currentProject = item;
            }
        });

        this.scope.$evalAsync(() => {
        });

    }

    goToDashboard() {
        this.state.go('dashboard', { 'appName': _.last(this.projects).id });
    }

    goToEditProject() {
        this.state.go('editProject', { 'appName': _.last(this.projects).id });
    }


    openMenu($mdOpenMenu, event) {
        $mdOpenMenu(event);
    }

    static subBarControllerFactory() {
        require('./subBar.scss');
        function subBarController($state, $scope, $ngRedux) {
            return new SubBarController($state, $scope, $ngRedux);
        }

        subBarController.$inject = ['$state', '$scope', '$ngRedux'];

        return subBarController;
    }

}

export default SubBarController;
