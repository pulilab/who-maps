import DashboardService from './DashboardService.js';
import DashboardMapService from './DashboardMapService.js';

// import perfMockMap from './CountryMap/mock/perfMockMap.js';

import commProjects from './Mocks/commProjects.js';

class DashboardModuleController {

    constructor($scope, $state) {

        const vm = this;

        // Bindings
        vm.scope = $scope;
        vm.state = $state;
        vm.EE = window.EE;

        this.projectId = $state.params.appName;
        vm.currentVersion = 0;

        vm.service = new DashboardService(this.state.params.appName);
        vm.mapService = new DashboardMapService();

        // Uncomment below to see current countries and id-s
        // vm.mapService.getCountries();

        vm.fetchProjectData();
        vm.fetchAxisData();

        vm.service.getCoverageVersions(this.projectId).then(data => {

            const ret = {};
            ret.labels = data.reduce((toRet, version) => {
                version.data.forEach(el => {
                    if (toRet.indexOf(el.district) < 0) {
                        toRet = toRet.concat(el.district);
                    }
                });
                return toRet;
            }, []);
            // console.debug('LABELS', ret.labels);

            const lastVersion = data[(data.length - 1)];
            // console.debug('LAST VERSION', lastVersion);

            ret.data = { date: lastVersion.modified };
            lastVersion.data.forEach(distObj => {
                ret.data[distObj.district] = {
                    clients: distObj.clients,
                    facilities: distObj.facilities,
                    workers: distObj.health_workers
                    // Every other keys, maybe _, on the component too!!!
                };
            });
            // console.debug('FINAL PARSED COVERAGE: ', ret);

            vm.EE.emit('mapdataArrived', ret);

            vm.perfMockMap = ret;
        });

        // Should serialize this somehow
        vm.fetchCountryMap(5);

        vm.fetchToolkitVersions();

        // Mocks
        // vm.perfMockMap = perfMockMap;
        // vm.perfMockmap =
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
            // console.log('Axisdata', data);
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


            const domainData = {
                'labels': [
                    'Groundwork',
                    'Partnerships',
                    'Financial health',
                    'Technology & Architecture',
                    'Operations',
                    'Monitoring & evaluation'
                ],
                'Groundwork': {
                    labels: [
                        'Parameters of scale',
                        'Contextual environment',
                        'Scientific basis'
                    ],
                    data: []
                },
                'Partnerships': {
                    labels: [
                        'Strategic engagement',
                        'Partnership sustainability'
                    ],
                    data: []
                },
                'Financial health': {
                    labels: [
                        'Financial management',
                        'Financial model'
                    ],
                    data: []
                },
                'Technology & Architecture': {
                    labels: [
                        'Data',
                        'Interoperabilty',
                        'Adaptability'
                    ],
                    data: []
                },
                'Operations': {
                    labels: [
                        'Personell',
                        'Training & support',
                        'Outreach & sanitization',
                        'Contingency planning'
                    ],
                    data: []
                },
                'Monitoring & evaluation': {
                    labels: [
                        'Process monitoring',
                        'Evaluation reach'
                    ],
                    data: []
                }
            };

            domainData.labels.forEach((axis, axInd) => {
                domainData[axis].data = data.map(version => {
                    const ret = {};
                    ret.date = version.modified;
                    version.data[axInd].domains.forEach((domain, domainInd) => {
                        ret['axis' + (domainInd + 1)] = domain.domain_percentage / 100;
                    });
                    return ret;
                });
            });
            vm.EE.emit('domain chart data', domainData);
        });
    }

    // fetchCountries() {

    //     this.mapService.getCountries().then(data => {

    //         this.countryIds = data.reduce((ret, el) => {
    //             ret[el.name] = el.id;
    //             return ret;
    //         }, {});

    //         this.fetchCountryMap();
    //     });
    // }

    fetchCountryMap(id) {

        // console.debug('TRYING TO FETCH COUNTRYMAP for ID:', id);
        this.mapService.getCountryTopo(id).then(data => {

            // console.debug('RAW topo arrived from API, will send over EE', data);
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
