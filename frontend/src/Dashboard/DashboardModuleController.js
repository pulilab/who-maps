import DashboardService from './DashboardService.js';
import DashboardMapService from './DashboardMapService.js';
import AuthApi from '../Common/AuthApi';
import { StaticUtilities } from '../Utilities';
import { Protected } from '../Common/';
import _ from 'lodash';

import commProjects from './Mocks/commProjects.js';

class DashboardModuleController extends Protected {

    constructor($scope, $state, $timeout) {

        super();
        this.scope = $scope;
        this.state = $state;
        this.timeout = $timeout;
        this.EE = window.EE;
        this.$onInit = this.onInit.bind(this);
        this.$onDestroy = this.onDestroy.bind(this);
    }

    onInit() {

        this.reqCs();

        this.defaultOnInit();
        this.projectId = this.state.params.appName;
        this.currentVersion = 0;
        this.service = new DashboardService(this.projectId);
        this.mapService = new DashboardMapService();

        this.fetchAxisData();

        const data = this.cs.getProjectData(this.projectId);
        this.addResourcesMeta(data);
        this.timeout(() => { this.fetchProjectData(data); });
        this.fetchToolkitData();

        this.commProjects = commProjects;
        this.resizeEvent();
        this.eventBinding();
    }

    onDestroy() {

        this.defaultOnDestroy();
        this.eventRemoving();
    }

    reqCs() {

        this.cs = require('../Common/CommonServices');
    }

    resizeEvent() {

        let doit;
        this.resizefn = () => {
            clearTimeout(doit);
            doit = setTimeout(this.resizedw, 50);
        };
        window.onresize = this.resizefn;
        this.resizedw = () => {
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
            this.fillImproveArray(data);
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

        this.service.getToolkitVersions(this.projectId).then(data => {

            this.currentVersion = data.length;

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
                axis1: this.rawToolkitData[0].axis_score / 100,
                axis2: this.rawToolkitData[1].axis_score / 100,
                axis3: this.rawToolkitData[2].axis_score / 100,
                axis4: this.rawToolkitData[3].axis_score / 100,
                axis5: this.rawToolkitData[4].axis_score / 100,
                axis6: this.rawToolkitData[5].axis_score / 100,
                date: todayString
            };

            axisData.data.push(lastAxisData);
            this.EE.emit('axis chart data', axisData);


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
                this.rawToolkitData[axInd].domains.forEach((dom, ii) => {
                    current['axis' + (ii + 1)] = dom.domain_percentage / 100;
                });
                domainData[axis].data.push(current);

                // console.debug(axInd + 1 + 'th axiss domaindata:', domainData[axis].data);
            });
            this.EE.emit('domain chart data', domainData);
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

        if (this.pi[projectIndex] === 0) {
            return;
        }
        this.pi[projectIndex] -= 1;
    }

    nextProject(projectIndex) {

        if (this.pi[projectIndex] === this.commProjects[projectIndex].length - 1) {
            return;
        }
        this.pi[projectIndex] += 1;
    }

    addResourcesMeta(data) {

        const res = { reports: [], articles: [] };

        data.reports.forEach(link => {
            if (_.keys(link).length) {
                res.reports.push({
                    type: 'link',
                    link: link.value,
                    title: 'Where should I know?'
                });
            }
        });

        data.publications.forEach(link => {
            if (_.keys(link).length) {
                res.articles.push({
                    type: 'link',
                    link: link.value,
                    // Needed data!
                    title: 'Where should I know?'
                });
            }
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

    fillImproveArray(data) {

        let counter = 1;
        const ret = [];

        data.forEach((axisObj, i) => {
            axisObj.domains.forEach((domainObj, j) => {
                // console.log(domainObj);
                ret.push(
                    {
                        id: counter,
                        name: domainObj.domain
                            .split(':')[1]
                            .trim()
                            .toLowerCase(),
                        axis: +i,
                        domain: +j,
                        completion: domainObj.domain_completion,
                        percentage: Math.round(domainObj.domain_percentage)
                    }
                );
                counter += 1;
            });
        });
        this.improveArray = ret;
        console.info('the improveArray:', this.improveArray);


        this.improveNr = this.calculateWorstId(ret);
        console.info('the first index:', this.improveNr);

        console.info('first obj from array:', this.improveArray[this.improveNr]);
    }

    calculateWorstId(data) {
        if (data.every(dom => dom.completion === 0)) {

            return Math.floor(Math.random() * 17);
            // INVESTIGATE 16 problem
        }
        return data.filter(dom => dom.completion > 0)
            .reduce((res, act) => act.percentage < res.percentage ? act : res, { percentage: 200 }).id - 1;
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
