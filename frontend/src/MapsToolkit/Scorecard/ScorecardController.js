import _ from 'lodash';
import { Protected } from '../../Common/';
import MapsToolkitService from '../MapsToolkitService';

class ScorecardController extends Protected {
    constructor($scope, $state, structure) {
        super();
        this.scope = $scope;
        this.state = $state;
        this.structure = structure;
        this.EE = window.EE;
        this.$onInit = this.onInit.bind(this);
        this.$onDestroy = this.onDestroy.bind(this);
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

    onDestroy() {
        this.defaultOnDestroy();
        this.EE.removeListener('mapsAxisChange', this.goToAxis, this);
    }

    onInit() {
        this.defaultOnInit();
        this.dataLoaded = false;
        this.projectId = this.state.params.appName;
        this.axisId = this.state.params.axisId;
        this.ms = new MapsToolkitService(this.projectId);
        this.ms.getProjectData().then(this.handleProjectData);
        this.EE.on('mapsAxisChange', this.goToAxis, this);
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
