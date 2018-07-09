import _template from './Login.html';
import LoginController from './LoginController';

const loginComponent = {
  controller: LoginController.loginFactory(),
  template: _template,
  controllerAs: 'vm',
  name: 'login'
};

export default loginComponent;
