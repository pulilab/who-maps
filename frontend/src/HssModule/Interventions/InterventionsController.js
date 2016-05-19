import _ from 'lodash';
import { Protected } from '../../Common/';

class InterventionsController extends Protected {

    constructor() {
        super();
        const vm = this;
        vm.EE = window.EE;
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
                let _activated = this.data.continuum[value].mother;
                if (this.data.continuum[value].child) {
                    _activated = _activated || this.data.continuum[value].child;
                }
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

    saveInterventions(columnId, value) {
        this.hs.postInterventions(columnId, value);
        this.calculateInterventionHeight(value);
    }

    static interventionsFactory() {
        require('./Interventions.scss');
        function interventions() {
            return new InterventionsController();
        }

        interventions.$inject = [];

        return interventions;
    }

}

export default InterventionsController;
