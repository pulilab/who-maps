import _ from 'lodash';
import Clipboard from 'clipboard';
import * as ProjectModule from '../../store/modules/projects';

class SubBarController {

    constructor($state, $scope, $ngRedux) {
        this.state = $state;
        this.scope = $scope;
        this.$onInit = this.onInit.bind(this);
        this.$onDestroy = this.onDestroy.bind(this);
        this.unsubscribe = $ngRedux.connect(this.mapState, ProjectModule)(this);
        this.navigateToProject = this.navigateToProject.bind(this);
        this.iconFunction = this.iconFunction.bind(this);
    }

    mapState(state) {
        return {
            projects: ProjectModule.getPublishedProjects(state),
            userProfile: state.user.profile,
            currentProject: ProjectModule.getCurrentProject(state)
        };
    }

    onInit() {
        if (this.currentProject) {
            this.createShareDefinition();
        }
    }

    onDestroy() {
        this.unsubscribe();
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
