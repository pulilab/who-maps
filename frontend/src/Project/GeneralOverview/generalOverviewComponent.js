import _template from './GeneralOverview.html';
import _readOnlyTemplate from './ReadOnlyGeneralOverview.html';
import ProjectDetailsController from './GeneralOverviewController';

const component = {
    template: _template,
    controller: ProjectDetailsController.factory(),
    controllerAs: 'vm',
    name: 'generalOverview',
    bindings: {
        form: '<',
        project: '<',
        structure: '<',
        team: '<',
        viewers: '<',
        users: '<'
    }
};

export default component;
export const readOnlyGeneralOverview = { ...component, template: _readOnlyTemplate, name: 'readOnlyGeneralOverview' };
