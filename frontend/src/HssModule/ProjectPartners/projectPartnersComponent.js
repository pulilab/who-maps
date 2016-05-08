import _template from './ProjectPartners.html';
import ProjectPartnersController from './ProjectPartnersController';

const projectPartnersComponent = {
    controller: ProjectPartnersController.projectPartnersFactory(),
    template: _template,
    controllerAs: 'vm',
    name: 'projectpartners'
};

export default projectPartnersComponent;
