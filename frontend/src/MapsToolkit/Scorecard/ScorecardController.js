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

    initialization() {
        this.dataLoaded = false;
        this.projectId = this.state.params.appName;
        this.axisId = this.state.params.axisId;
        this.ms = new MapsToolkitService(this.projectId);
        this.ms.getProjectData().then(this.handleProjectData);
    }

    handleProjectData(data) {
        this.axis = data[this.axisId];
        this.axesSize = data.length;
        this.axisStructure = this.structure[this.axisId];
        this.axisName = this.axis.axis.split('.')[1];
        const axisName = this.axis.axis.split('.')[0].replace(' ', '').toLowerCase();
        this.axisClass = axisName;
        this.axisPicture = require('./images/icon-' + axisName + '.svg');

        this.data = _.merge(this.axis.domains, this.axisStructure);
        this.dataLoaded = true;
        this.scope.$evalAsync();
    }

    updateScore(domain) {
        const domainId = domain.id - 1;
        const axisId = this.axisId;
        this.state.go('maps', { axisId, domainId });
    }

    goToNextAxis() {
        const axisId = parseInt(this.axisId, 10) + 1;
        this.state.go('maps', { axisId });
    }

    disableGoToNextAxis() {
        return this.axisId + 1 >= this.axesSize;
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
