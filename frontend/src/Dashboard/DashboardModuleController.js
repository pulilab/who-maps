import chartData from './Mocks/chartmock.js';
import chartData2 from './Mocks/chartmock2.js';
import perfMockMap from './CountryMap/mock/perfMockMap.js';

// To-do: working on this thing!
import DashboardService from './DashboardService.js';
import commProjects from './Mocks/commProjects.js';

class DashboardModuleController {

    constructor($scope, $state) {
        const vm = this;
        vm.scope = $scope;
        vm.state = $state;
        vm.EE = window.EE;

        vm.service = new DashboardService(this.state.params.appName);
        vm.fetchProjectData();

        // Mocks
        vm.linechartMockData = chartData;
        vm.linechartMockData2 = chartData2;
        vm.perfMockMap = perfMockMap;
        vm.commProjects = commProjects;

        vm.resizedw = () => {
            this.EE.emit('dashResized');
        };

        let doit;
        vm.resizefn = () => {

            clearTimeout(doit);
            doit = setTimeout(vm.resizedw, 50);
        };
        window.onresize = vm.resizefn;
        this.EE.on('mapsDomainChange', this.handleChangeDomain.bind(this));
    }

    fetchProjectData() {
        this.service.getProjectData().then(data => {
            this.projectData = data;
        });
    }

    handleChangeDomain(id) {
        this.state.go('maps', { 'domainId': id });
    }

    prewProject(projectIndex) {
        const vm = this;
        if (vm.pi[projectIndex] === 0) {
            return;
        }
        vm.pi[projectIndex] -= 1;
    }

    nextProject(projectIndex) {
        const vm = this;
        if (vm.pi[projectIndex] === vm.commProjects[projectIndex].length - 1) {
            return;
        }
        vm.pi[projectIndex] += 1;
    }

    static dashboardControllerFactory() {
        function dashController($scope, $state) {

            return new DashboardModuleController($scope, $state);
        }

        dashController.$inject = ['$scope', '$state'];

        return dashController;
    }
}

export default DashboardModuleController;
