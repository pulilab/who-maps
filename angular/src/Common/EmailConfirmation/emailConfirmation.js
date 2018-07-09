import _template from './EmailConfirmation.html';
import EmailConfirmationController from './EmailConfirmationController';

const emailConfirmationComponent = {
  controller: EmailConfirmationController.emailConfirmationFactory(),
  template: _template,
  controllerAs: 'vm',
  name: 'emailConfirmation'
};

export default emailConfirmationComponent;
