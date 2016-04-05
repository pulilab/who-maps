import _ from 'lodash';
import { hss, interventionsLib } from '../hssMockData';

class InterventionsController {

    constructor($timeout) {
        const vm = this;
        $timeout(() => {
            vm.EE = window.EE;
            vm.editMode = false;
            vm.interventionsRowSpan = {
                size: 5
            };
            this.resizeRow = this.resizeRow.bind(this);
            this.calculateInterventionHeight = this.calculateInterventionHeight.bind(this);
            this.interventionRow = this.middleColumnGenerator();
            vm.EE.on('hssEditMode', this.handleEditMode.bind(this));
            vm.EE.on('hssColumnActiveState', this.handleColumnActivation.bind(this));
        });
    }

    handleEditMode(value) {
        this.editMode = value;
        this.checkSelected();
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
        classArray.push(tile.introName);
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
                    rowSpan: 5,
                    columnId: value,
                    activated: _activated,
                    selectValues: interventionsLib[value],
                    introName: 'interventions_middle_' + value,
                    classGenerator: self.classGenerator
                };
            })
            .value();
    }

    checkSelected() {
        const max = _.maxBy(this.interventionRow, item => {
            if (item && item.content) {
                return item.content.length;
            }
            return 0;
        });
        if (max.content) {
            this.resizeRow(Math.abs(max.content.length / 1.5));
        }

    }

    calculateInterventionHeight(newValue) {
        if (!newValue.length) {
            return;
        }
        this.resizeRow(newValue.length * 0.5);
    }

    resizeRow(newValue) {
        if (!newValue) {
            return;
        }
        const rowSpan = Math.max(newValue, this.interventionsRowSpan.size);
        this.interventionsRowSpan.size = rowSpan;
        _.forEach(this.interventionRow, item => {
            item.rowSpan = rowSpan;
        });
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
