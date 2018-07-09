import _template from './donors.html';
import './donors.scss';

const donorsComponent = {
  template: _template,
  controllerAs: 'vm',
  name: 'donors',
  bindings: {
    number: '='
  }
};

export default donorsComponent;
