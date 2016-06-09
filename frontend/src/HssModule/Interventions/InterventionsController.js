import _ from 'lodash';
import { Protected } from '../../Common/';

class InterventionsController extends Protected {

    constructor($scope) {
        super();
        const vm = this;
        vm.EE = window.EE;
        vm.scope = $scope;
        vm.$onInit = vm.onInit.bind(vm);
        vm.$onDestroy = vm.onDestroy.bind(vm);
    }

    onInit() {
        const vm = this;
        vm.defaultOnInit();
        vm.editMode = false;
        vm.interventionsRowSpan = {
            size: 5
        };
        this.gridLoading = false;
        this.resizeRow = this.resizeRow.bind(this);
        this.calculateInterventionHeight = this.calculateInterventionHeight.bind(this);
        vm.hs = vm.service;
        vm.interventionRow = this.middleColumnGenerator();
        vm.ageRangesRow = vm.ageRangeColumnGenerator();
        vm.bindEvents();
    }

    bindEvents() {
        const vm = this;
        vm.EE.on('hssEditMode', vm.handleEditMode, vm);
        vm.EE.on('hssGuysActivateColumn', vm.handleColumnActivation, vm);
    }

    removeEvents() {
        const vm = this;
        vm.EE.removeListener('hssEditMode', vm.handleEditMode, vm);
        vm.EE.removeListener('hssGuysActivateColumn', vm.handleColumnActivation, vm);
    }

    onDestroy() {
        const vm = this;
        vm.defaultOnDestroy();
        vm.removeEvents();
    }

    handleEditMode(value) {
        this.editMode = value;
        this.checkSelected();
    }

    layoutDone() {
        this.EE.emit('hssInnerLayoutDone', 'interventions');
    }


    handleColumnActivation(event) {
        _.map(this.interventionRow, (value) => {
            if (value.columnId === event.columnId) {
                value.activated = event.activated;
            }
            return value;
        });

        _.map(this.ageRangesRow, (value) => {
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
                const _activated = this.data.continuum[value].state;
                return {
                    content: this.data.interventions[value].interventions,
                    className: 'intervention',
                    colSpan: 1,
                    rowSpan: 5,
                    columnId: value,
                    activated: _activated,
                    selectValues: this.structure.interventions[value],
                    introName: 'interventions_middle_' + value,
                    classGenerator: self.classGenerator,
                    saveInterventions: self.saveInterventions.bind(this, value)
                };
            })
            .value();
    }

    ageRangeColumnGenerator() {
        const self = this;
        return _.chain(this.tiles)
            .range()
            .map((value) => {
                const _activated = this.data.continuum[value].state;
                return {
                    content: this.data.age_ranges[value].age_ranges,
                    className: 'intervention',
                    colSpan: 1,
                    rowSpan: 5,
                    columnId: value,
                    activated: _activated,
                    selectValues: this.structure.age_ranges,
                    introName: 'interventions_middle_' + value,
                    classGenerator: self.classGenerator,
                    saveAgeRanges: self.saveAgeRanges.bind(this, value)
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
        if (!newValue || !newValue.length) {
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

    stripParenthesis(str) {
        return str.split('(')[0];
    }

    saveAgeRanges(columnId, value) {
        this.ageRangesRow[columnId].content = value;
        this.hs.postAgeRanges(columnId, value);
    }

    saveInterventions(columnId, value) {
        this.interventionRow[columnId].content = value;
        this.hs.postInterventions(columnId, value);
        this.calculateInterventionHeight(value);
    }

    static interventionsFactory() {
        require('./Interventions.scss');
        function interventions($scope) {
            return new InterventionsController($scope);
        }

        interventions.$inject = ['$scope'];

        return interventions;
    }

}

export default InterventionsController;
