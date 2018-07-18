import CountryFieldsController from './CountryFieldsController';
import _template from './CountryFields.html';
import _readOnlyTemplate from './ReadOnlyCountryFields.html';

const component = {
  template: _template,
  controller: CountryFieldsController.factory(),
  controllerAs: 'vm',
  name: 'countryFields',
  bindings: {
    form: '<',
    project: '<',
    isPublished: '<',
    isNewProject: '<',
    showCountryFields: '=',
    activateValidation: '<'
  }
};

export default component;
export const readOnlyCountryFields = { ...component, name: 'readOnlyCountryFields', template: _readOnlyTemplate };
