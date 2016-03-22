import _ from 'lodash';
import { hss } from '../hssMockData';

class ContinuumController {

    constructor($timeout) {
        const vm = this;
        $timeout(() => {
            vm.EE = window.EE;
            vm.editMode = false;
            vm.firstRow = this.firstRowGenerator();
            vm.motherRow = this.motherRowGenerator();
            vm.childRow = this.childRowGenerator();
            vm.motherRow.forEach(tile => {
                vm.checkColumnActivation(tile);

                console.log(tile.columnId + ' activated? ' + vm.firstRow[tile.columnId].activated);
            });

            vm.exportPdf = this.exportPdf;
            vm.mapsProgressPercentage = 68; // Placeholder!!
        });
    }

    editModeChange() {
        const vm = this;
        this.EE.emit('hssEditMode', vm.editMode);
    }

    firstRowGenerator() {
        return _.map(_.range(this.tiles), value => {
            return {
                type: 'firstrow',
                icon: require('./images/continuum-' + (value + 1) + '.svg'),
                colSpan: 1,
                rowSpan: 1,
                columnId: value,
                classGenerator: this.classGenerator
            };
        });
    }

    motherRowGenerator() {
        const self = this;
        return _.chain(this.tiles)
            .range()
            .map(value => {
                return {
                    type: 'mother',
                    content: hss[value].mother.title,
                    colSpan: hss[value].mother.span,
                    rowSpan: 1,
                    invisible: _.isEmpty(hss[value].mother),
                    clickHandler: this.toggleColumnActivationClick.bind(self),
                    columnId: value,
                    activated: hss[value].mother.activated,
                    introName: 'mother_middle_' + value,
                    classGenerator: this.classGenerator
                };
            })
            .filter({
                invisible: false
            })
            .value();
    }

    childRowGenerator() {
        const self = this;
        return _.chain(this.tiles)
            .range()
            .map(value => {
                return {
                    type: 'child',
                    content: hss[value].child.title,
                    className: 'child',
                    colSpan: 1,
                    rowSpan: 1,
                    columnId: value,
                    activated: hss[value].child.activated,
                    empty: !hss[value].child.title,
                    clickHandler: this.toggleColumnActivationClick.bind(self),
                    introName: 'child_middle_' + value,
                    invisible: false,
                    classGenerator: this.classGenerator
                };
            })
            .value();
    }

    classGenerator(tile) {
        const classes = [];
        classes.push(tile.type);
        classes.push((tile.columnId + 1) % 2 === 0 ? 'even' : 'odd');
        classes.push(tile.activated ? 'activated' : 'deactivated');

        if (tile.type === 'child') {
            classes.push(hss[tile.columnId].child.title ? 'filled' : 'empty');
        }

        return classes.join(' ');
    }

    toggleColumnActivationClick(tile) {

        if (this.editMode && !tile.empty) {

            tile.activated = !tile.activated;
            this.checkColumnActivation(tile);
        }

    }

    // Global Column activation handling (missing childs/double)
    checkColumnActivation(tile) {
        if (tile.columnId < 4) {
            this.firstRow[tile.columnId].activated = tile.activated;
            this.columnChEmit(tile.columnId, tile.activated);
        }
        else if (tile.columnId === 4) {
            this.firstRow[tile.columnId].activated = tile.activated ||
                this.motherRow[4].activated ||
                this.childRow[4].activated;
            this.columnChEmit(4, this.firstRow[tile.columnId].activated);
        }
        else if (tile.columnId === 5) {
            this.firstRow[5].activated = this.childRow[5].activated || this.motherRow[5].activated;
            this.columnChEmit(5, this.firstRow[5].activated);

            this.firstRow[6].activated = this.childRow[6].activated || this.motherRow[5].activated;
            this.columnChEmit(6, this.firstRow[6].activated);
        }
        else {
            this.firstRow[6].activated = this.childRow[6].activated || this.motherRow[5].activated;
            this.columnChEmit(6, this.firstRow[6].activated);
        }
    }

    columnChEmit(column, state) {
        this.EE.emit('hssColumnActiveState', {
            columnId: column,
            activated: state
        });
    }

    exportPdf() {
        console.warn('The "export to .pdf" function is not yet available!');
    }


    static continuumFactory() {
        require('./Continuum.scss');
        function continuum($timeout) {
            return new ContinuumController($timeout);
        }

        continuum.$inject = ['$timeout'];

        return continuum;
    }
}

export default ContinuumController;
