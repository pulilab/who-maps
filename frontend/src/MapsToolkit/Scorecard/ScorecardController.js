import _ from 'lodash';
import * as ToolkitModule from '../../store/modules/toolkit';

class ScorecardController {
    constructor($scope, $state, $ngRedux) {
        this.scope = $scope;
        this.state = $state;
        this.EE = window.EE;
        this.$onInit = this.onInit.bind(this);
        this.$onDestroy = this.onDestroy.bind(this);
        this.handleProjectData = this.handleProjectData.bind(this);
        this.mapData = this.mapData.bind(this);
        this.unsubscribe = $ngRedux.connect(this.mapData, ToolkitModule)(this);
    }

    mapData(state) {
        const structure = ToolkitModule.getStructure();
        const rawData = ToolkitModule.getToolkitData(state);
        // this.processAxesData(rawData);
        return {
            rawData,
            structure,
            data: _.merge(rawData, structure),
            axesSize: rawData.length,
            domainStructure: ToolkitModule.getDomainStructure(this.axisId, this.domainId)
        };
    }

    importIconTemplates() {
        // Import the whole folder in an collection of string templates, needed for proper webpack optimizations
        const templates = {};
        const templateRequire = require.context('./images/', true, /\.svg$/);
        templateRequire.keys().forEach((item) => {
            const key = item.split('.')[1].replace('/', '');
            templates[key] = templateRequire(item);
        });
        return templates;
    }

    onDestroy() {
        this.EE.removeListener('mapsAxisChange', this.goToAxis, this);
    }

    onInit() {
        this.dataLoaded = false;
        this.projectId = this.state.params.appName;
        this.axisId = this.state.params.axisId;
        this.EE.on('mapsAxisChange', this.goToAxis, this);
    }

    handleProjectData(data) {
        this.axesSize = data.length;
        this.createAxisData();

        if (!this.summary) {
            this.data = this.data[this.axisId];
        }

        this.dataLoaded = true;
        this.scope.$evalAsync();
    }

    createAxisData() {
        const images = this.importIconTemplates();
        _.forEach(this.data, (axis, key) => {
            axis.id = key;
            axis.axisName = axis.axis.split('.')[1];
            axis.axisClass = axis.axis.split('.')[0].replace(' ', '').toLowerCase();
            axis.axisPicture = images['icon-' + axis.axisClass];
            _.forEach(axis.domains, (domain, index) => {
                domain.index = index;
            });
        });
    }

    updateScore(domain, axis) {
        const domainId = domain.index;
        const axisId = axis ? axis.id : this.axisId;
        this.state.go(this.viewMode ? 'public-maps' : 'maps', { axisId, domainId });
    }

    goToAxis(id) {
        const axisId = id || this.axisId;
        this.state.go(this.viewMode ? 'public-maps' : 'maps', { axisId });
    }

    goToNextAxis() {
        const axisId = parseInt(this.axisId, 10) + 1;
        this.state.go(this.viewMode ? 'public-maps' : 'maps', { axisId });
    }

    goToSummary() {
        this.state.go(this.viewMode ? 'public-summary' : 'summary');
    }

    goToDashboard() {
        this.state.go(this.viewMode ? 'public-dashboard' : 'dashboard');
    }

    isLastAxis() {
        return parseInt(this.axisId, 10) + 1 >= this.axesSize;
    }

    static scorecardFactory() {
        const scorecard = ($scope, $state, $ngRedux) => {
            require('./Scorecard.scss');
            return new ScorecardController($scope, $state, $ngRedux,);
        };
        scorecard.$inject = ['$scope', '$state', '$ngRedux'];
        return scorecard;
    }

}


export default ScorecardController;
