import LandingPageController from './LandingPageController';
import _template from './LandingPageModule.html';
import './landingPage.scss';

const hssComponent = {
    controller: LandingPageController.landingControllerFactory(),
    template: _template,
    controllerAs: 'vm',
    name: 'landingPage'
};

export default hssComponent;
