import _ from 'lodash';
import { interventionsLib } from '../hssMockData';

class InterventionsController {

    constructor($timeout) {
        const vm = this;
        $timeout(() => {
            vm.EE = window.EE;
            vm.editMode = false;
            this.middleRow = this.middleColumnGenerator();
            vm.EE.on('hssEditMode', this.handleEditMode.bind(this));
            vm.EE.on('hssColumnActiveState', this.handleColumnActivation.bind(this));
        });
    }

    handleEditMode(value) {
        this.editMode = value;
    }

    handleColumnActivation(event) {
        _.map(this.middleRow, (value) => {
            if (value.columnId === event.columnId) {
                value.activated = event.activated;
            }
            return value;
        });
    }

    classGenerator(tile) {
        const classArray = [tile.className];
        classArray.push((tile.columnId + 1) % 2 === 0 ? 'even' : 'odd');
        return classArray.join(' ');
    }

    middleColumnGenerator() {
        const self = this;
        return _.chain(this.tiles)
            .range()
            .map((value) => {
                return {
                    content: null,
                    className: 'intervention',
                    colSpan: 1,
                    rowSpan: 4,
                    columnId: value,
                    activated: false,
                    selectValues: interventionsLib[value],
                    introName: 'interventions_middle_' + value,
                    classGenerator: self.classGenerator
                };
            })
            .value();
    }

    static interventionsFactory() {
        require('./Interventions.scss');
        function interventions($timeout) {
            return new InterventionsController($timeout);
        }

        interventions.$inject = ['$timeout'];

        return interventions;
    }

}

export default InterventionsController;
