import * as ProjectModule from '../../store/modules/projects';

class MyProjectListController {
  constructor ($scope, $state, $ngRedux) {
    this.scope = $scope;
    this.state = $state;
    this.$ngRedux = $ngRedux;
    this.$onInit = this.onInit.bind(this);
    this.$onDestroy = this.onDestroy.bind(this);
  }

  onInit () {
    this.unsubscribe = this.$ngRedux.connect(this.mapState, ProjectModule)(this);
  }
  onDestroy () {
    this.unsubscribe();
  }

  mapState (state) {
    return {
      projects: ProjectModule.getUserProjects(state)
    };
  }

  static factory () {
    require('./MyProjectList.scss');
    function myProjectList ($scope, $state, $ngRedux) {
      return new MyProjectListController($scope, $state, $ngRedux);
    }
    myProjectList.$inject = ['$scope', '$state', '$ngRedux'];
    return myProjectList;
  }
}

export default MyProjectListController;
