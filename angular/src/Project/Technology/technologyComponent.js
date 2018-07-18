import TechnologyController from './TechnologyController';
import _template from './Technology.html';
import _readOnlyTemplate from './ReadOnlyTechnology.html';

const component = {
  template: _template,
  controller: TechnologyController.technologyControllerFactory(),
  controllerAs: 'vm',
  name: 'technology',
  bindings: {
    form: '<',
    project: '<',
    structure: '<',
    activateValidation: '<'
  }
};

export default component;
export const readOnlyTechnology = { ...component, name: 'readOnlyTechnology', template: _readOnlyTemplate };
