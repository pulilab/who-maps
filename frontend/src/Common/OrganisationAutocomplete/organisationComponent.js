import _template from './Organisation.html';
import OrganisationController from './OrganisationController';


const component = {
    template: _template,
    controller: OrganisationController.organisationFactory(),
    controllerAs: 'vm',
    name: 'organisationAutocomplete',
    bindings: {
        organisation: '=',
        form: '<',
        notRequired: '<'
    }
};

export default component;
