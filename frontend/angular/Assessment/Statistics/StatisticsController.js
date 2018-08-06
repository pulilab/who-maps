class StatisticsController {
  constructor ($scope, $state, $ngRedux) {
    this.scope = $scope;
    this.state = $state;
    this.$ngRedux = $ngRedux;
    this.$onInit = this.onInit;
    this.$onDestroy = this.onDestroy;
  }

  onInit () {
    this.isPublic = false;
    this.projectData = window.$nuxt.$store.getters['projects/getCurrentProject'];
    this.userProfile = window.$nuxt.$store.getters['user/getProfile'];
    this.currentVersion = window.$nuxt.$store.getters['projects/getToolkitVersions'].length;
  }

  onDestroy () {
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
