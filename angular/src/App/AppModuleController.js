import debounce from 'lodash/debounce';
import * as SystemModule from '../store/modules/system';
import * as ProjectModule from '../store/modules/projects';

class AppModuleController {
  constructor ($state, $scope, $rootScope, $mdDialog, $ngRedux, gettextCatalog) {
    this.state = $state;
    this.scope = $scope;
    this.$mdDialog = $mdDialog;
    this.rootScope = $rootScope;
    this.$onInit = this.onInit.bind(this);
    this.$onDestroy = this.onDestroy.bind(this);
    this.mapState = this.mapState.bind(this);
    this.unsubscribe = $ngRedux.connect(this.mapState, SystemModule)(this);
    this.invalidProjectHandler = debounce(this.invalidProjectHandler.bind(this), 300);
    this.dialogManager(gettextCatalog);
  }

  mapState (state) {
    const meta = {
      location: { ...this.state.current },
      store: state
    };
    const token = state.user.token ? `Token ${state.user.token}` : '';
    const isProjectValid = ProjectModule.checkCurrentProjectValidity(state);
    this.invalidProjectHandler(isProjectValid);
    return {
      meta,
      token,
      user: state.user,
      projects: state.projects
    };
  }

  onInit () {
    this.watchers();
    this.projectId = this.state.params.appName;
    this.currentPage = this.state.current.name;
    this.showCountryTopBar = false;
  }

  onDestroy () {
    this.unsubscribe();
  }

  invalidProjectHandler (validity) {
    if (!validity.isValid && validity.id === parseInt(this.state.params.appName, 10)) {
      this.state.go('dashboard', null, { location: 'replace' });
      this.$mdDialog.show(this.savingError);
    }
  }

  dialogManager (gettextCatalog) {
    this.savingError = this.$mdDialog.alert({
      title: gettextCatalog.getString('Attention'),
      textContent: gettextCatalog.getString('You do not have access to this project and ' +
            'you have been redirected to the dashboard '),
      ok: gettextCatalog.getString('Close'),
      theme: 'alert'
    });
  }

  computeShowSubBar () {
    return !this.showCountryTopBar &&
          this.user && this.projects &&
          this.projects.length !== 0 &&
          this.state.current.name !== 'newProject';
  }

  watchers () {
    this.scope.$watch(() => {
      return this.state.current.name;
    }, value => {
      this.currentPage = value;
      this.showSubBar = this.computeShowSubBar();
    });
  }

  static appControllerFactory () {
    function appController ($state, $scope, $rootScope, $mdDialog, $ngRedux, gettextCatalog) {
      return new AppModuleController($state, $scope, $rootScope, $mdDialog, $ngRedux, gettextCatalog);
    }

    appController.$inject = ['$state', '$scope', '$rootScope', '$mdDialog', '$ngRedux', 'gettextCatalog'];

    return appController;
  }
}

export default AppModuleController;
