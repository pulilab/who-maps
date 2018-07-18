import _template from './app.html';
import AppController from './AppModuleController';

const appComponent = {
  controller: AppController.appControllerFactory(),
  template: _template,
  controllerAs: 'vm',
  name: 'app',
  bindings: {
    viewMode: '@'
  }
};

export default appComponent;
