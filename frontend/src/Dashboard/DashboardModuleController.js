import DashboardService from './DashboardService.js';
import { Protected } from '../Common/';
import _ from 'lodash';

import commProjects from './Mocks/commProjects.js';

class DashboardModuleController extends Protected {

    constructor($scope, $state, $timeout, CommonServices) {

        super();
        this.scope = $scope;
        this.state = $state;
        this.timeout = $timeout;
        this.EE = window.EE;
        this.cs = CommonServices;
        this.$onInit = this.onInit;
        this.$onDestroy = this.onDestroy;
    }

    onInit() {
        this.defaultOnInit();
        this.projectId = this.state.params.appName;
        this.currentVersion = 0;
        this.setUserType();
        if (this.cs.userProfile) {
            this.adjustUserType(this.cs.userProfile);
        }

        this.service = new DashboardService(this.projectId);
        this.mapService = require('../Common/CustomCountryService');

        if (this.projectId) {
            this.cs.getProjectData(this.projectId).then(data => {
                this.fetchProjectData(data);
            });
            if (this.userType !== 0) {
                this.fetchToolkitData();
            }
        }

        this.commProjects = commProjects;
        this.resizeEvent();
        this.eventBinding();

        this.pgArray = [
            {
                title: 'Use the existing evidence base to bolster interventions',
                description: 'Project teams should remember that mHealth is a catalytic' +
                ' tool and not often a health Lorem ipsum dolor sit amet,' +
                ' consectetur adipisicing elit, sed do eiusmod.',
                commentNr: 17,
                imageURL: 'someURL'
            },
            {
                title: 'Conduct formative work to understand your context',
                description: 'Formative research is critical for local validation and ' +
                'contextualization of mHealth Lorem ipsum dolor sit amet, consectetur' +
                ' adipisicing elit, sed do eiusmod',
                commentNr: 6,
                imageURL: 'someURL'
            },
            {
                title: 'Lorem ipsum dolor sit amet, consectetur adipisici elit',
                description: 'A short description!',
                commentNr: 0,
                imageURL: 'someURL'
            }
        ];
    }

    onDestroy() {
        this.defaultOnDestroy();
        this.eventRemoving();
        this.userType = 0;
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
        if (this.userType !== 0) {
            this.fetchCountryMap(data.country);
            this.parseMapData(data.coverage, data.national_level_deployment);
            this.fetchCoverageVersions();
        }
    }

    parseMapData(coverage, national) {
        const ret = { labels: [], data: {} };
        coverage.forEach(el => {
            if (ret.labels.indexOf(el.district) < 0) {
                ret.labels.push(el.district);
            }
        });

        coverage.forEach(distObj => {

            ret.data[distObj.district] = {};

            _.forOwn(distObj, (val, key) => {

                if (key === 'district') { return; }
                const formattedKey = key.replace('_', ' ');
                ret.data[distObj.district][formattedKey] = val;
            });
        });

        this.EE.emit('mapdataArrived', ret, national);
        this.perfMockMap = ret;
    }

    snapShot() {
        this.service.snapShot(this.projectId).then((newVersion) => {
            const patch = newVersion.coverage;
            this.cs.updateProject(patch, this.projectData);
            this.EE.emit('projectListUpdated');
            this.state.go('dashboard', { 'app': this.projectId }, { reload: true });
        });
    }

    fetchToolkitData() {

        this.service.getToolkitData(this.projectId).then(data => {
            // console.debug('RAW Toolkit data', data);
            this.axisData = data;
            this.fillImproveArray(data);
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
                        'Interoperability',
                        'Adaptability'
                    ],
                    data: []
                },
                'Operations': {
                    labels: [
                        'Personnel',
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
        this.mapService.getCountryMapData(id).then(data => {
            this.EE.emit('topoArrived', data);
        });
    }

    fetchCoverageVersions() {

        this.service.getCoverageVersions(this.projectId).then(data => {

            // console.debug(this.projectData);
            const coverage = this.projectData.coverage.slice();
            coverage.push(Object.assign({}, this.projectData.national_level_deployment));
            data.push({ data: coverage });


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


    fillImproveArray(data) {

        let counter = 1;
        const ret = [];

        data.forEach((axisObj, i) => {
            axisObj.domains.forEach((domainObj, j) => {
                ret.push({
                    id: counter,
                    name: domainObj.domain.split(':')[1].trim().toLowerCase(),
                    axis: +i,
                    domain: +j,
                    completion: domainObj.domain_completion,
                    percentage: Math.round(domainObj.domain_percentage)
                });
                counter += 1;
            });
        });
        this.improveArray = ret;

        this.improveNr = this.calculateWorstId(ret);
    }

    calculateWorstId(data) {
        if (data.every(dom => dom.completion === 0)) {

            return Math.floor(Math.random() * 16);
        }
        return data.filter(dom => dom.completion > 0)
            .reduce((res, act) => act.percentage < res.percentage ? act : res, { percentage: 200 }).id - 1;
    }

    static dashboardControllerFactory() {
        const CommonServices = require('../Common/CommonServices');
        function dashController($scope, $state, $timeout) {

            return new DashboardModuleController($scope, $state, $timeout, CommonServices);
        }

        dashController.$inject = ['$scope', '$state', '$timeout'];

        return dashController;
    }
}

export default DashboardModuleController;
