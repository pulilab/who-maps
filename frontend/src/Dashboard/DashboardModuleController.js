import DashboardService from './DashboardService.js';
import DashboardMapService from './DashboardMapService.js';

import chartData from './Mocks/chartmock.js';
import chartData2 from './Mocks/chartmock2.js';
import perfMockMap from './CountryMap/mock/perfMockMap.js';

import commProjects from './Mocks/commProjects.js';

class DashboardModuleController {

    constructor($scope, $state) {
        const vm = this;
        vm.scope = $scope;
        vm.state = $state;
        vm.EE = window.EE;

        this.projectId = $state.params.appName;
        vm.currentVersion = 0;

        vm.service = new DashboardService(this.state.params.appName);
        vm.fetchProjectData();
        vm.fetchAxisData();

        vm.mapService = new DashboardMapService();
        vm.fetchCountries();

        // Mocks
        vm.linechartMockData = chartData;
        // vm.linechartMockData = vm.fetchToolkitVersions();
        vm.fetchToolkitVersions();
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
        vm.EE.on('mapsDomainChange', this.handleChangeDomain.bind(this));
        vm.EE.on('mapsAxisChange', this.handleChangeAxis.bind(this));
    }

    fetchProjectData() {

        this.service.getProjectData(this.projectId).then(data => {
            this.projectData = data;
            // console.log('ProjectData', data);
        });
    }

    snapShot() {
        this.service.snapShot(this.projectId).then(() => {
            this.state.go('dashboard', { 'axisId': this.projectId }, { reload: true });
        });
    }

    fetchAxisData() {

        this.service.getAxisData().then(data => {
            this.axisData = data;
            console.log('Axisdata', data);
        });
    }

    fetchToolkitVersions() {

        const vm = this;

        vm.service.getToolkitVersions(vm.projectId).then(data => {

            vm.currentVersion = data.length;


            const axisData = {
                labels: [
                    'Groundwork',
                    'Partnership',
                    'Financial health',
                    'Technology & Architecture',
                    'Operations',
                    'Monitoring & Evaulation'
                ],
                data: []
            };

            axisData.data = data.map(version => {
                return {
                    date: version.modified,
                    axis1: version.data[0].axis_score / 100,
                    axis2: version.data[1].axis_score / 100,
                    axis3: version.data[2].axis_score / 100,
                    axis4: version.data[3].axis_score / 100,
                    axis5: version.data[4].axis_score / 100,
                    axis6: version.data[5].axis_score / 100
                };
            });

            vm.EE.emit('axis chart data', axisData);


            // const domainData = {
            //     'labels': [
            //         'Groundwork',
            //         'Partnerships',
            //         'Financial health',
            //         'Technology & Architecture',
            //         'Operations',
            //         'Monitoring & evaluation'
            //     ],
            //     'Groundwork': {
            //         labels: [
            //             'Parameters of scale',
            //             'Contextual environment',
            //             'Scientific basis'
            //         ],
            //         data: []
            //     },
            //     'Partnerships': {
            //         labels: [
            //             'Strategic engagement',
            //             'Partnership sustainability'
            //         ],
            //         data: []
            //     },
            //     'Financial health': {
            //         labels: [
            //             'Financial management',
            //             'Financial model'
            //         ],
            //         data: []
            //     },
            //     'Technology & Architecture': {
            //         labels: [
            //             'Data',
            //             'Interoperabilty',
            //             'Adaptability'
            //         ],
            //         data: []
            //     },
            //     'Operations': {
            //         labels: [
            //             'Personell',
            //             'Training & support',
            //             'Outreach & sanitization',
            //             'Contingency planning'
            //         ],
            //         data: []
            //     },
            //     'Monitoring & evaluation': {
            //         labels: [
            //             'Process monitoring',
            //             'Evaluation reach'
            //         ],
            //         data: []
            //     }
            // };

            // domainData.labels.forEach((axis, axInd) => {
            //     Data is there fetch it correctly mofo!
            //     console.log(axInd, axis);
            // });

        });
    }

    fetchCountries() {

        this.mapService.getCountries().then(data => {

            this.countryIds = data.reduce((ret, el) => {
                ret[el.name] = el.id;
                return ret;
            }, {});
            this.fetchCountryMap();
        });
    }

    fetchCountryMap() {
        const countryId = this.countryIds['sierra-leone'];

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
