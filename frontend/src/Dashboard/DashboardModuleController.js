import DashboardService from './DashboardService.js';
import DashboardMapService from './DashboardMapService.js';
import AuthApi from '../Common/AuthApi';
import { StaticUtilities } from '../Utilities';
import _ from 'lodash';
import { Protected } from '../Common/';

import commProjects from './Mocks/commProjects.js';

class DashboardModuleController extends Protected {

    constructor($scope, $state, $timeout) {
        super();
        const vm = this;
        vm.scope = $scope;
        vm.state = $state;
        vm.timeout = $timeout;
        vm.EE = window.EE;
        vm.$onInit = vm.onInit.bind(vm);
        vm.$onDestroy = vm.onDestroy.bind(vm);

    }

    onInit() {
        const vm = this;
        vm.cs = require('../Common/CommonServices');

        vm.defaultOnInit();
        vm.projectId = vm.state.params.appName;
        vm.currentVersion = 0;
        vm.service = new DashboardService(vm.projectId);
        vm.mapService = new DashboardMapService();

        vm.fetchAxisData();

        const data = vm.cs.getProjectData(this.projectId);
        vm.addResourcesMeta(data);
        vm.timeout(() => { vm.fetchProjectData(data); });
        vm.fetchToolkitData();

        vm.commProjects = commProjects;
        vm.resizeEvent();
        vm.eventBinding();
    }

    onDestroy() {
        const vm = this;
        vm.defaultOnDestroy();
        vm.eventRemoving();
    }

    resizeEvent() {
        const vm = this;
        let doit;
        vm.resizefn = () => {
            clearTimeout(doit);
            doit = setTimeout(vm.resizedw, 50);
        };
        window.onresize = vm.resizefn;
        vm.resizedw = () => {
            this.EE.emit('dashResized');
        };
    }

    eventBinding() {
        this.EE.on('mapsDomainChange', this.handleChangeDomain, this);
        this.EE.on('mapsAxisChange', this.handleChangeAxis, this);
    }
    eventRemoving() {
        this.EE.removeListener('mapsDomainChange', this.handleChangeDomain, this);
        this.EE.removeListener('mapsAxisChange', this.handleChangeAxis, this);
    }

    fetchProjectData(data) {
        // console.debug('ProjectData', data);
        this.EE.emit('country Changed');
        this.projectData = data;
        this.fetchCountryMap(data.country);
        this.parseMapData(data.coverage);
        this.fetchCoverageVersions();
    }

    parseMapData(coverage) {
        // console.debug('COVERAGE from API', coverage);
        const ret = { labels: [], data: {} };

        coverage.forEach(el => {
            if (ret.labels.indexOf(el.district) < 0) {
                ret.labels.push(el.district);
            }
        });
        // console.debug('Labels', ret.labels);

        coverage.forEach(distObj => {

            ret.data[distObj.district] = {};

            _.forOwn(distObj, (val, key) => {
                // console.debug(key, val);
                if (key === 'district') { return; }

                const formattedKey = key.replace('_', ' ');

                ret.data[distObj.district][formattedKey] = val;
            });

        });
        // console.debug('FINAL PARSED COVERAGE: ', ret);

        this.EE.emit('mapdataArrived', ret);
        this.perfMockMap = ret;
    }

    snapShot() {
        this.service.snapShot(this.projectId).then(() => {
            this.state.go('dashboard', { 'axisId': this.projectId }, { reload: true });
        });
    }

    fetchAxisData() {

        this.service.getAxisData().then(data => {
            this.axisData = data;
            // console.debug('Axisdata', data);
        });
    }

    fetchToolkitData() {
        this.service.getToolkitData(this.projectId).then(data => {
            // console.debug('RAW Toolkit data', data);
            this.rawToolkitData = data;
            this.fetchToolkitVersions();
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
            // Data from versions
            axisData.data = data.map(version => {
                return {
                    date: version.modified.split('T')[0],
                    axis1: version.data[0].axis_score / 100,
                    axis2: version.data[1].axis_score / 100,
                    axis3: version.data[2].axis_score / 100,
                    axis4: version.data[3].axis_score / 100,
                    axis5: version.data[4].axis_score / 100,
                    axis6: version.data[5].axis_score / 100
                };
            });

            const today = new Date();
            const year = today.getFullYear();
            const month = ('0' + (today.getMonth() + 1)).slice(-2);
            const day = ('0' + today.getDate()).slice(-2);

            const todayString = [year, month, day].join('-');

            // Current data (from tooltip)
            const lastAxisData = {
                axis1: vm.rawToolkitData[0].axis_score / 100,
                axis2: vm.rawToolkitData[1].axis_score / 100,
                axis3: vm.rawToolkitData[2].axis_score / 100,
                axis4: vm.rawToolkitData[3].axis_score / 100,
                axis5: vm.rawToolkitData[4].axis_score / 100,
                axis6: vm.rawToolkitData[5].axis_score / 100,
                date: todayString
            };

            axisData.data.push(lastAxisData);
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
                    ret.date = version.modified.split('T')[0];
                    version.data[axInd].domains.forEach((domain, domainInd) => {
                        ret['axis' + (domainInd + 1)] = domain.domain_percentage / 100;
                    });
                    return ret;
                });


                const current = { date: todayString };
                vm.rawToolkitData[axInd].domains.forEach((dom, ii) => {
                    current['axis' + (ii + 1)] = dom.domain_percentage / 100;
                });
                domainData[axis].data.push(current);

                // console.debug(axInd + 1 + 'th axiss domaindata:', domainData[axis].data);

            });
            vm.EE.emit('domain chart data', domainData);
        });
    }

    fetchCountryMap(id) {

        // console.debug('TRYING TO FETCH COUNTRYMAP for ID:', id);
        this.mapService.getCountryTopo(id).then(data => {

            // console.debug('RAW topo arrived from API, will send over EE', data);
            this.EE.emit('topoArrived', data);
        });
    }

    fetchCoverageVersions() {

        this.service.getCoverageVersions(this.projectId).then(data => {

            data.push({ data: this.projectData.coverage });

            const today = new Date();
            const year = today.getFullYear();
            const month = ('0' + (today.getMonth() + 1)).slice(-2);
            const day = ('0' + today.getDate()).slice(-2);

            const todayString = [year, month, day].join('-');

            const historyChartData = data.reduce((ret, versionObj, vInd) => {

                ret.data[vInd] = {};
                ret.data[vInd].date = versionObj.modified ? versionObj.modified.split('T')[0] : todayString;

                versionObj.data.forEach(distrObj => {

                    _.forOwn(distrObj, (val, key) => {

                        if (key !== 'district') {

                            const newKey = key.replace('_', ' ');

                            if (ret.labels.indexOf(newKey) < 0) { ret.labels.push(newKey); }

                            const name = 'axis' + (ret.labels.indexOf(newKey) + 1);

                            ret.data[vInd][name] = (ret.data[vInd][name] || 0) + val;

                        }

                    });
                });

                return ret;
            }, { labels: [], data: [] });

            this.EE.emit('coverage chart data', historyChartData);

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

    addResourcesMeta(data) {

        const res = { reports: [], articles: [] };

        data.reports.forEach(link => {
            res.reports.push({
                type: 'link',
                link: link.value,
                title: 'Where should I know?'
            });
        });

        data.publications.forEach(link => {
            res.articles.push({
                type: 'link',
                link: link.value,
                // Needed data!
                title: 'Where should I know?'
            });
        });

        data.files.forEach(fileObj => {
            if (fileObj.type === 'report') {
                res.reports.push({
                    type: 'file',
                    filename: fileObj.filename,
                    id: fileObj.id,
                    ext: fileObj.filename.split('.').slice(-1)[0],
                    // Needed data!
                    date: '#dateUploadedOrGiven',
                    size: '#XY0Mb'
                });
            }
            else {
                console.error('File type (not report) isn\'t handled yet in the dashboardCtrl!');
            }
        });

        this.resources = res;
    }

    downloadRes(resObj) {

        return new AuthApi('').getBlob(`files/${resObj.id}/`)
            .then(data => {
                StaticUtilities.launchDownload(data, resObj.filename);
            });
    }

    static dashboardControllerFactory() {
        function dashController($scope, $state, $timeout) {

            return new DashboardModuleController($scope, $state, $timeout);
        }

        dashController.$inject = ['$scope', '$state', '$timeout'];

        return dashController;
    }
}

export default DashboardModuleController;
