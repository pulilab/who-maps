import _template from './disclaimer.html';
import './disclaimer.scss';
import DisclaimerController from './DisclaimerController';

const donorsComponent = {
    template: _template,
    name: 'disclaimer',
    controllerAs: 'vm',
    controller: DisclaimerController.factory()
};

export default donorsComponent;
