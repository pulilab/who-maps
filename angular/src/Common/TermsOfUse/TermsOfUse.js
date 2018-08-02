import _template from './TermsOfUse.html';
import TermOfUseController from './TermsOfUseController';

const termsOfUse = {
  controller: TermOfUseController.termOfUseFactory(),
  template: _template,
  controllerAs: 'vm',
  name: 'termsOfUse'
};

export default termsOfUse;
