import _ from 'lodash';
import * as ProjectModule from '../store/modules/projects';
import * as CountriesModule from '../store/modules/countries';

import commProjects from './Mocks/commProjects.js';

class DashboardModuleController {

    constructor($scope, $state, $timeout, $ngRedux) {
        this.scope = $scope;
        this.state = $state;
        this.timeout = $timeout;
        this.EE = window.EE;
        this.$onInit = this.onInit;
        this.$onDestroy = this.onDestroy;
        this.unsubscribeProjects = $ngRedux.connect(this.mapData, ProjectModule)(this);
        this.watchers = this.watchers.bind(this);
        this.watchers();
    }

    mapData(state) {
        return {
            projects: ProjectModule.getPublishedProjects(state),
            projectData: ProjectModule.getCurrentProject(state),
            rawToolkitData: ProjectModule.getToolkitData(state),
            axisData: ProjectModule.getToolkitData(state),
            toolkitVersion: ProjectModule.getToolkitVersion(state),
            coverageVersion: ProjectModule.getCoverageVersion(state),
            profile: state.user.profile,
            currentVersion: ProjectModule.getCurrentVersion(state),
            mapData: CountriesModule.getCurrentCountryMapData(state)
        };
    }

    watchers() {
        this.scope.$watch(s => s.vm.projectData, data => {
            this.adjustProjectData(data);
        });
        this.scope.$watch(s => s.vm.coverageVersion, data => {
            this.adjustCoverageVersions(data);
        });
    }

    onInit() {
        this.projectId = this.state.params.appName;
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
        this.eventRemoving();
        this.userType = 0;
        this.unsubscribeProjects();
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

    async adjustProjectData(data) {
        if (this.profile && data && data.country) {
            this.districtProjects = this.parseCoverage(data);
            this.nationalLevelCoverage = data.national_level_deployment;
        }
    }

    parseCoverage(data) {
        if (!data || !Array.isArray(data.coverage)) {
            return {};
        }
        const cov = {};
        for (const d of data.coverage) {
            cov[d.district] = {
                clients: d.clients,
                health_workers: d.health_workers,
                facilities: d.facilities
            };
        }
        return cov;
    }


    snapShot() {
        return this.snapShotProject();
    }


    adjustCoverageVersions(data) {
        if (!data) {
            return;
        }

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
    }

    handleChangeDomain(axisId, domainId) {
        this.state.go('maps', { axisId, domainId });
    }

    handleChangeAxis(id) {
        this.state.go('maps', { 'axisId': id, 'domainId': 0 });
    }


    static dashboardControllerFactory() {
        function dashController($scope, $state, $timeout, $ngRedux) {

            return new DashboardModuleController($scope, $state, $timeout, $ngRedux);
        }

        dashController.$inject = ['$scope', '$state', '$timeout', '$ngRedux'];

        return dashController;
    }
}

export default DashboardModuleController;
