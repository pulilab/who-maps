import _template from './UUIDLoad.html';
import UUIDLoadController from './UUIDLoadController';

const emailConfirmationComponent = {
  controller: UUIDLoadController.uuidLoadFactory(),
  template: _template,
  controllerAs: 'vm',
  name: 'uuidLoad'
};

export default emailConfirmationComponent;
