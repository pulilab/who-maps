import _ from 'lodash';
import MapsToolkitService from '../MapsToolkitService';

class ScorecardController {
    constructor($scope, $state, structure) {
        this.scope = $scope;
        this.state = $state;
        this.structure = structure;
        this.EE = window.EE;
        this.$onInit = this.initialization.bind(this);
        this.handleProjectData = this.handleProjectData.bind(this);
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

    initialization() {
        this.dataLoaded = false;
        this.projectId = this.state.params.appName;
        this.axisId = this.state.params.axisId;
        this.ms = new MapsToolkitService(this.projectId);
        this.ms.getProjectData().then(this.handleProjectData);
    }

    handleProjectData(data) {
        this.axesSize = data.length;
        this.data = _.merge(data, this.structure);
        this.rawData = _.cloneDeep(data);
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
        this.state.go('maps', { axisId, domainId });
    }

    goToNextAxis() {
        const axisId = parseInt(this.axisId, 10) + 1;
        this.state.go('maps', { axisId });
    }

    isLastAxis() {
        return parseInt(this.axisId, 10) + 1 >= this.axesSize;
    }

    static scorecardFactory() {
        const scorecard = ($scope, $state) => {
            require('./Scorecard.scss');
            const structure = require('../Resource/structure.json');
            return new ScorecardController($scope, $state, structure);
        };
        scorecard.$inject = ['$scope', '$state'];
        return scorecard;
    }

}


export default ScorecardController;
