import DashboardModuleController from './DashboardModuleController';
import _template from './Dashboard.html';
import './Dashboard.scss';

const hssComponent = {
    controller: DashboardModuleController.dashboardControllerFactory(),
    template: _template,
    controllerAs: 'vm',
    name: 'dashboard',
    bindings: {
        viewMode: '@'
    }
};

export default hssComponent;
