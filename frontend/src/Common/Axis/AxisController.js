import * as ToolkitModule from '../../store/modules/toolkit';


class AxisController {

    constructor($scope, $ngRedux) {
        this.scope = $scope;
        this.$ngRedux = $ngRedux;
        this.EE = window.EE;
        this.$onInit = this.onInit.bind(this);
        this.$onDestroy = this.onDestroy.bind(this);
        this.mapState = this.mapState.bind(this);
        this.changeDomain = this.changeDomain.bind(this);
    }

    mapState(state) {
        const axisId = parseInt(this.axisIndex, 10) + 1;
        const domainId = this.domainIndex ? parseInt(this.domainIndex, 10) + 1 : null;
        const axis = ToolkitModule.getAxisDetail(state, axisId);
        const axisClass = axis.axis.split('.')[0].replace(' ', '').toLowerCase();
        const axisPicture = require('./images/icon-' + axisClass + '.svg');
        const axisScorePercentage =  axis.axis_score;
        const axisCompletion =  axis.axis_completion;
        return {
            axisId,
            domainId,
            axisPicture,
            axisName: axis.name,
            axisClass,
            axisScoreClass: this.advanceClassGenerator(axisScorePercentage),
            axisCompletionClass: this.advanceClassGenerator(axisCompletion),
            domains: axis.domains
        };
    }

    onInit() {
        if (this.axisId === null || this.axisId === void 0) {
            this.axisId = 0;
        }
        this.unsubscribe = this.$ngRedux.connect(this.mapState, null)(this);
    }

    onDestroy() {
        this.unsubscribe();
    }

    setDomainActive(id) {
        if (this.domainIndex) {
            return parseInt(this.domainIndex, 10) === id;
        }
        return false;
    }


    changeDomain(domain) {
        this.EE.emit('mapsDomainChange', this.axisIndex, domain.index);
    }

    goToAxis() {
        const axisId = parseInt(this.axisId, 10) - 1;
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
        function newAxis($scope, $ngRedux) {
            return new AxisController($scope, $ngRedux);
        }
        newAxis.$inject = ['$scope', '$ngRedux'];
        return newAxis;
    }
}

export default AxisController;
