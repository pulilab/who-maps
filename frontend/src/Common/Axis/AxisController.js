import _ from 'lodash';


class AxisController {

    constructor($scope) {
        this.scope = $scope;
        this.$onInit = this.initialization.bind(this);
        this.changeDomain = this.changeDomain.bind(this);
    }

    initialization() {
        if (!this.axisData) {
            this.axisData = require('./axisMockData').default;
        }
        this.EE = window.EE;
        this.axisName = this.axisData.axis.split('.')[1];
        const axisName = this.axisData.axis.split('.')[0].replace(' ', '').toLowerCase();
        this.axisClass = axisName;
        this.axisPicture = require('./images/icon-' + axisName + '.svg');
        this.axisScorePercentage = this.axisData.axis_score;
        this.axisCompletition = this.axisCompletitionCalculator();
        this.axisScoreClass = this.advanceClassGenerator(this.axisScorePercentage);
        this.axisCompletitionClass = this.advanceClassGenerator(this.axisCompletition);
        this.domains = this.axisData.domains;
        this.parseDomainData();
    }

    parseDomainData() {
        _.forEach(this.domains, (domain, index) => {
            domain.scorePercentage = (domain.domain_sum * 100) / domain.domain_max;
            domain.name = domain.domain.split(':')[1].toLowerCase();
            domain.index = index;
        });
    }

    changeDomain(domain) {
        this.EE.emit('mapsDomainChange', domain.index);
    }


    axisCompletitionCalculator() {
        let completition = 0;
        _.forEach(this.axisData.domains, domain => {
            completition += domain.domain_percentage;
        });
        return completition / this.axisData.domains.length;
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
