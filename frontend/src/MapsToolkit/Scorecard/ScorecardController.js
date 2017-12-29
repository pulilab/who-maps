import merge from 'lodash/merge';
import cloneDeep from 'lodash/cloneDeep';
import forEach from 'lodash/forEach';

import * as ToolkitModule from '../../store/modules/toolkit';

class ScorecardController {
    constructor($scope, $state, $ngRedux) {
        this.scope = $scope;
        this.state = $state;
        this.$ngRedux = $ngRedux;
        this.EE = window.EE;
        this.$onInit = this.onInit.bind(this);
        this.$onDestroy = this.onDestroy.bind(this);
        this.mapData = this.mapData.bind(this);
        this.watchers = this.watchers.bind(this);
        this.createAxisData = this.createAxisData.bind(this);
    }

    mapData(state) {
        const structure = ToolkitModule.getStructure(state);
        const rawData = ToolkitModule.getToolkitData(state);
        return {
            rawData,
            structure,
            axesSize: rawData.length
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

    onInit() {
        this.dataLoaded = false;
        this.images = this.importIconTemplates();
        this.projectId = this.state.params.appName;
        this.unsubscribe = this.$ngRedux.connect(this.mapData, ToolkitModule)(this);
        this.axisId = this.state.params.axisId;
        this.watchers();
        this.EE.on('mapsAxisChange', this.goToAxis, this);
    }

    onDestroy() {
        this.EE.removeListener('mapsAxisChange', this.goToAxis, this);
        this.unsubscribe();
    }

    watchers() {
        this.scope.$watch(s => s.vm.rawData, this.createAxisData, true);
    }

    createAxisData(rawData) {
        if (rawData && rawData.length > 0) {
            const data = merge(rawData, this.structure).map((a, key) => {
                const axis = cloneDeep(a);
                axis.id = key;
                axis.axisName = axis.axis.split('.')[1];
                axis.axisClass = axis.axis.split('.')[0].replace(' ', '').toLowerCase();
                axis.axisPicture = this.images['icon-' + axis.axisClass];
                forEach(axis.domains, (domain, index) => {
                    domain.index = index;
                });
                return axis;
            });
            this.dataLoaded = true;
            this.data =  this.summary ? data : data[this.axisId];
        }
        return [];
    }

    updateScore(domain, axis) {
        const domainId = domain.index;
        const axisId = axis ? axis.id : this.axisId;
        this.state.go(this.viewMode ? 'public-maps' : 'maps', { axisId, domainId });
    }

    goToAxis(id) {
        const axisId = id === undefined || id === null ? this.axisId : id;
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
            return new ScorecardController($scope, $state, $ngRedux);
        };
        scorecard.$inject = ['$scope', '$state', '$ngRedux'];
        return scorecard;
    }

}


export default ScorecardController;
