import _template from './GeneralOverview.html';
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
        users: '<',
        projectList: '<'
    }
};

export default component;
