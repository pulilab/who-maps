import chartData from './Mocks/chartmock.js';
import chartData2 from './Mocks/chartmock2.js';
import perfMockMap from './CountryMap/mock/perfMockMap.js';
import mockAxis from './Mocks/mockAxis.js';
import commProjects from './Mocks/commProjects.js';

class DashboardModuleController {

    constructor($scope) {
        const vm = this;
        vm.scope = $scope;
        vm.EE = window.EE;
        vm.linechartMockData = chartData;
        vm.linechartMockData2 = chartData2;
        vm.mockAxis = mockAxis;
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
        function dashController() {

            return new DashboardModuleController();
        }

        dashController.$inject = ['$scope'];

        return dashController;
    }
}

export default DashboardModuleController;
