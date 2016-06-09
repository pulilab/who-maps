import _template from './RefreshProject.html';
import RefreshProjectController from './RefreshProjectController';


const emailConfirmationComponent = {
    controller: RefreshProjectController.refreshProjectFactory(),
    template: _template,
    controllerAs: 'vm',
    name: 'refreshProject'
};

export default emailConfirmationComponent;
