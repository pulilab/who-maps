import CountryFieldsController from './CountryFieldsController';
import _template from './CountryFields.html';


const technology = {
    template: _template,
    controller: CountryFieldsController.factory(),
    controllerAs: 'vm',
    name: 'countryFields',
    bindings: {
        form: '<',
        project: '<',
        countryFields: '<',
        activateValidation: '<'
    }
};

export default technology;
