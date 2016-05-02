import DashboardService from './DashboardService.js';
import DashboardMapService from './DashboardMapService.js';

import chartData from './Mocks/chartmock.js';
import chartData2 from './Mocks/chartmock2.js';
import perfMockMap from './CountryMap/mock/perfMockMap.js';

import commProjects from './Mocks/commProjects.js';

class DashboardModuleController {

    constructor($scope, $state) {

        const vm = this;

        // Bindings
        vm.scope = $scope;
        vm.state = $state;
        vm.EE = window.EE;

        vm.service = new DashboardService(this.state.params.appName);
        vm.mapService = new DashboardMapService();

        // vm.projectData
        // vm.axisData


        vm.fetchProjectData();

        // Mocks
        vm.linechartMockData = chartData;
        vm.linechartMockData2 = chartData2;
        vm.perfMockMap = perfMockMap;
        vm.commProjects = commProjects;

        // Letting components know about browser window resize
        vm.resizedw = () => {
            this.EE.emit('dashResized');
        };
        let doit;
        vm.resizefn = () => {

            clearTimeout(doit);
            doit = setTimeout(vm.resizedw, 50);
        };
        window.onresize = vm.resizefn;

        // Routers for the axis components
        this.EE.on('mapsDomainChange', this.handleChangeDomain.bind(this));
        this.EE.on('mapsAxisChange', this.handleChangeAxis.bind(this));
    }

    fetchProjectData() {

        this.fetchAxisData();

        this.service.getProjectData(this.state.params.appName).then(data => {

            this.projectData = data;

            this.fetchCountryMap(data.country);
        });
    }

    fetchAxisData() {

        this.service.getAxisData().then(data => {
            this.axisData = data;
        });
    }

    fetchCountryMap(countryId) {

        this.mapService.getCountryTopo(countryId).then(data => {

            this.EE.emit('topoArrived', data);
        });
    }

    handleChangeDomain(axisId, domainId) {

        this.state.go('maps', { axisId, domainId });
    }

    handleChangeAxis(id) {

        this.state.go('maps', { 'axisId': id, 'domainId': 0 });
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
