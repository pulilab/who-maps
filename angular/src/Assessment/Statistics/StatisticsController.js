import * as ProjectModule from '../../store/modules/projects';
import * as UserModule from '../../store/modules/user';

class StatisticsController {
  constructor ($scope, $state, $ngRedux) {
    this.scope = $scope;
    this.state = $state;
    this.$ngRedux = $ngRedux;
    this.$onInit = this.onInit;
    this.$onDestroy = this.onDestroy;
    this.mapData = this.mapData.bind(this);
  }

  mapData (state) {
    this.isPublic = this.state.current.name === 'public-dashboard';
    const projectData = this.isPublic ? ProjectModule.getCurrentPublicProject(state)
      : ProjectModule.getCurrentProject(state);
    return {
      projectData,
      profile: UserModule.getProfile(state),
      currentVersion: ProjectModule.getCurrentVersion(state)
    };
  }

  onInit () {
    this.unsubcribe = this.$ngRedux.connect(this.mapData, ProjectModule)(this);
  }

  onDestroy () {
    this.unsubcribe();
  }

  snapShot () {
    return this.snapShotProject();
  }

  goToEditProject () {
    this.state.go('editProject');
  }

  static factory () {
    function statistics ($scope, $state, $ngRedux) {
      return new StatisticsController($scope, $state, $ngRedux);
    }

    statistics.$inject = ['$scope', '$state', '$ngRedux'];

    return statistics;
  }
}

export default StatisticsController;
