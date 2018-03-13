import DashboardModuleController from './DashboardModuleController.js';
import _template from './Dashboard.html';
import './Dashboard.scss';

const dashboardComponent = {
    controller: DashboardModuleController.factory(),
    template: _template,
    controllerAs: 'vm',
    name: 'dashboard'
};

export default dashboardComponent;
