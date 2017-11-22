import _ from 'lodash';


class AxisController {

    constructor($scope) {
        this.scope = $scope;
        this.EE = window.EE;
        this.$onInit = this.initialization.bind(this);
        this.changeDomain = this.changeDomain.bind(this);
        this.parseAxisData = this.parseAxisData.bind(this);
    }

    initialization() {
        if (!this.axisData) {
            this.axisData = require('./axisMockData');
        }
        if (this.axisId === null || this.axisId === void 0) {
            this.axisId = 0;
        }
        this.watchers();

    }

    watchers() {
        this.scope.$watch(s => s.vm.axisData, this.parseAxisData, true);
    }

    parseAxisData(axisData) {
        this.axisName = axisData.axis.split('.')[1];
        const axisName = axisData.axis.split('.')[0].replace(' ', '').toLowerCase();
        this.axisClass = axisName;
        this.axisPicture = require('./images/icon-' + axisName + '.svg');
        this.axisScorePercentage = axisData.axis_score;
        this.axisCompletition = axisData.axis_completion;
        this.axisScoreClass = this.advanceClassGenerator(this.axisScorePercentage);
        this.axisCompletitionClass = this.advanceClassGenerator(this.axisCompletition);
        this.domains = axisData.domains;
        this.parseDomainData();
    }

    setDomainActive(id) {
        if (this.domainId) {
            return parseInt(this.domainId, 10) === id;
        }
        return false;
    }

    parseDomainData() {
        _.forEach(this.domains, (domain, index) => {
            domain.name = domain.domain.split(':')[1].toLowerCase();
            domain.index = index;
        });
    }

    changeDomain(domain) {
        this.EE.emit('mapsDomainChange', this.axisId, domain.index);
    }

    goToAxis() {
        const axisId = this.axisId;
        this.EE.emit('mapsAxisChange', axisId);
    }


    advanceClassGenerator(value) {
        if (value < 50) {
            return 'red';
        }
        if (value < 100) {
            return 'yellow';
        }

        return 'green';
    }


    static axisFactory() {
        require('./Axis.scss');
        function signup($scope) {
            return new AxisController($scope);
        }
        signup.$inject = ['$scope'];
        return signup;
    }
}

export default AxisController;
