import _ from 'lodash';
import { hss, interventionsLib } from '../hssMockData';

class InterventionsController {

    constructor($timeout) {
        const vm = this;
        $timeout(() => {
            vm.EE = window.EE;
            vm.editMode = false;
            this.interventionRow = this.middleColumnGenerator();
            vm.EE.on('hssEditMode', this.handleEditMode.bind(this));
            vm.EE.on('hssColumnActiveState', this.handleColumnActivation.bind(this));
        });
    }

    handleEditMode(value) {
        this.editMode = value;
    }

    handleColumnActivation(event) {
        _.map(this.interventionRow, (value) => {
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
                let _activated = hss[value].mother.activated;
                if (hss[value].child) {
                    _activated = _activated || hss[value].child.activated;
                }
                return {
                    content: null,
                    className: 'intervention',
                    colSpan: 1,
                    rowSpan: 4,
                    columnId: value,
                    activated: _activated,
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
