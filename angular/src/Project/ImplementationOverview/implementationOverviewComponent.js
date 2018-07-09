import StrategyController from './ImplementationOverviewController';
import _template from './ImplementationOverview.html';
import _readOnlyTemplate from './ReadOnlyImplementationOverview.html';

const component = {
  template: _template,
  controller: StrategyController.factory(),
  controllerAs: 'vm',
  name: 'implementationOverview',
  bindings: {
    form: '<',
    project: '<',
    structure: '<',
    activateValidation: '<'
  }
};

export default component;
export const readOnlyImplementationOverview =
  { ...component, name: 'readOnlyImplementationOverview', template: _readOnlyTemplate };
