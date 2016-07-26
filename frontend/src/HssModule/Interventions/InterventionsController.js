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
            size: 1
        };
        vm.targetPopulationRowSpan = {
            size: 1
        };
        this.gridLoading = false;
        this.resizeInterventionsRow = this.resizeInterventionsRow.bind(this);
        this.calculateInterventionHeight = this.calculateInterventionHeight.bind(this);
        vm.hs = vm.service;
        vm.targetPopulationOptions = [
            {
                name: 'Age Ranges',
                item: _.cloneDeep(vm.structure.target_population.age_ranges)
            },
            {
                name: 'Special Population',
                item: _.cloneDeep(vm.structure.target_population.special_population)
            }
        ];

        vm.interventionRow = this.middleColumnGenerator();
        vm.specialPopulationRow = vm.specialPopulationsColumnGenerator();
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

        _.map(this.specialPopulationRow, (value) => {
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
                const content = this.data.interventions[value].interventions;
                self.calculateInterventionHeight(content);
                const _activated = this.data.continuum[value].state;
                return {
                    content,
                    className: 'intervention',
                    colSpan: 1,
                    rowSpan: this.interventionsRowSpan.size,
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

    specialPopulationsColumnGenerator() {
        const self = this;
        return _.chain(this.tiles)
            .range()
            .map((value) => {
                const content = _.concat(self.data.target_population[value].target_population.special_population,
                    self.data.target_population[value].target_population.age_ranges);
                self.calculateTargetPopulationHeight(content);
                const _activated = this.data.continuum[value].state;
                return {
                    content,
                    className: 'intervention',
                    colSpan: 1,
                    rowSpan: this.targetPopulationRowSpan.size,
                    columnId: value,
                    activated: _activated,
                    selectValues: self.targetPopulationOptions,
                    introName: 'interventions_middle_' + value,
                    classGenerator: self.classGenerator,
                    saveSpecialPopulations: self.saveSpecialPopulations.bind(this, value)
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
            this.resizeInterventionsRow(Math.abs(max.content.length / 1.5));
        }

    }

    calculateInterventionHeight(newValue) {
        if (!newValue || !newValue.length) {
            return;
        }
        this.resizeInterventionsRow(newValue.length * 0.6);
    }

    resizeInterventionsRow(newValue) {
        if (!newValue) {
            return;
        }
        const rowSpan = Math.max(newValue, this.interventionsRowSpan.size);
        this.interventionsRowSpan.size = rowSpan;
        _.forEach(this.interventionRow, item => {
            item.rowSpan = rowSpan;
        });
    }


    calculateTargetPopulationHeight(newValue) {
        if (!newValue || !newValue.length) {
            return;
        }
        this.resizeTargetPopulationRows(newValue.length * 0.6);
    }

    resizeTargetPopulationRows(newValue) {
        if (!newValue) {
            return;
        }
        const rowSpan = Math.max(newValue, this.targetPopulationRowSpan.size);
        this.targetPopulationRowSpan.size = rowSpan;
        _.forEach(this.specialPopulationRow, item => {
            item.rowSpan = rowSpan;
        });
    }


    saveSpecialPopulations(columnId, value) {
        const toSave = {
            special_population: [],
            age_ranges: []
        };

        _.forEach(value, item => {
            if (!_.isObject(item)) {
                const isAge = this.structure.target_population.age_ranges.indexOf(item) > -1;
                if (isAge) {
                    toSave.age_ranges.push(item);
                }
                else {
                    toSave.special_population.push(item);
                }
            }
        });
        this.specialPopulationRow[columnId].content = value;
        this.hs.postSpecialPopulations(columnId, toSave);
        this.calculateTargetPopulationHeight(value);

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
