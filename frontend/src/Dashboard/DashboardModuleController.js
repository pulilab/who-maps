import _ from 'lodash';
import * as ProjectModule from '../store/modules/projects';
import * as CountriesModule from '../store/modules/countries';
import * as  ToolkitModule from '../store/modules/toolkit';
import * as  UserModule from '../store/modules/user';

import commProjects from './Mocks/commProjects.js';

class DashboardModuleController {

    constructor($scope, $state, $timeout, $ngRedux) {
        this.scope = $scope;
        this.state = $state;
        this.timeout = $timeout;
        this.$ngRedux = $ngRedux;
        this.EE = window.EE;
        this.$onInit = this.onInit;
        this.$onDestroy = this.onDestroy;
        this.mapData = this.mapData.bind(this);
        this.watchers = this.watchers.bind(this);
        this.unsubscribeProjects = $ngRedux.connect(this.mapData, ProjectModule)(this);
        this.watchers();
    }

    mapData(state) {
        this.isPublic = this.state.current.name === 'public-dashboard';
        const projectData = this.isPublic ? ProjectModule.getCurrentPublicProject(state)
          : ProjectModule.getCurrentProject(state);
        return {
            projects: ProjectModule.getPublishedProjects(state),
            projectData,
            rawToolkitData: ToolkitModule.getToolkitData(state),
            axisData: ToolkitModule.getToolkitData(state),
            toolkitVersion: ProjectModule.getToolkitVersion(state),
            coverageVersion: ProjectModule.getCoverageVersion(state),
            profile: UserModule.getProfile(state),
            currentVersion: ProjectModule.getCurrentVersion(state),
            mapData: CountriesModule.getCurrentCountryMapData(state)
        };
    }

    watchers() {
        this.scope.$watch(s => s.vm.projectData, data => {
            this.adjustProjectData(data);
            this.$ngRedux.dispatch(CountriesModule.setCurrentCountry(data.country, ['mapData']));
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
        this.showEmpty = !this.projectId;
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

    adjustProjectData(data) {
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
        if (!data || this.isPublic) {
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
