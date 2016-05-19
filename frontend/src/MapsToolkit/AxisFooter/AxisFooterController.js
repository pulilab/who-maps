import _ from 'lodash';
import { Protected } from '../../Common/';

class AxisFooterController extends Protected {
    constructor($scope, $state) {
        super();
        this.scope = $scope;
        this.state = $state;
        this.EE = window.EE;
        this.$onInit = this.onInit.bind(this);
        this.$onDestroy = this.onDestroy.bind(this);
        this.changeAxis = this.changeAxis.bind(this);
    }

    onInit() {
        this.defaultOnInit();
        this.activeAxis = this.state.params.axisId;
        _.map(this.axes, (axis, index) => {
            axis.axisId = axis.axis.split('.')[0];
            axis.id = index;
            axis.isActive = this.activeAxis === '' + index;
            axis.axisName = axis.axis.split('.')[1].replace(' ', '');
            return axis;
        });
    }
    onDestroy() {
        this.defaultOnDestroy();
    }

    classGenerator(axis) {
        const classArray = [];
        classArray.push(axis.axisId.replace(' ', '_').toLowerCase());
        classArray.push(axis.isActive ? 'active' : 'notActive');
        return classArray.join(' ');
    }

    changeAxis(axis) {
        if (!axis.isActive) {
            this.EE.emit('mapsAxisChange', axis.id);
        }
    }

    static axisFooterFactory() {
        const axisFooter = ($scope, $state) => {
            require('./AxisFooter.scss');
            return new AxisFooterController($scope, $state);
        };
        axisFooter.$inject = ['$scope', '$state'];
        return axisFooter;
    }

}


export default AxisFooterController;
