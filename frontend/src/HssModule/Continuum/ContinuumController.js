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
        });
    }

    editModeChange() {
        const vm = this;
        this.EE.emit('hssEditMode', vm.editMode);
    }

    firstRowGenerator() {
        return _.map(_.range(this.tiles), value => {
            return {
                icon: require('./images/continuum-' + (value + 1) + '.svg'),
                colSpan: 1,
                rowSpan: 1,
                className: (value + 1) % 2 === 0 ? 'even' : 'odd'
            };
        });
    }

    classGenerator(tile) {
        const classString = [tile.className];
        classString.push((tile.columnId + 1) % 2 === 0 ? 'even' : 'odd');
        classString.push(tile.activated ? 'activated' : 'deactivated');
        return classString.join(' ');
    }

    motherRowGenerator() {
        const self = this;
        return _.chain(this.tiles)
            .range()
            .map(value => {
                return {
                    content: hss[value].mother.title,
                    colSpan: hss[value].mother.span,
                    rowSpan: 1,
                    invisible: _.isEmpty(hss[value].mother),
                    clickHandler: this.toggleColumnActivationClick.bind(self),
                    columnId: value,
                    activated: hss[value].activated,
                    className: 'mother',
                    introName: 'mother_middle_' + value,
                    classGenerator: this.classGenerator.bind(self)
                };
            })
            .filter({
                invisible: false
            })
            .value();
    }

    childClassGenerator(tile) {
        const classString = this.classGenerator(tile).split(' ');
        classString.push(!hss[tile.columnId].child.title ? 'empty' : 'filled');
        return classString.join(' ');
    }

    childRowGenerator() {
        const self = this;
        return _.chain(this.tiles)
            .range()
            .map(value => {
                return {
                    content: hss[value].child.title,
                    className: 'child',
                    colSpan: 1,
                    rowSpan: 1,
                    columnId: value,
                    activated: hss[value].activated,
                    empty: !hss[value].child.title,
                    clickHandler: this.toggleColumnActivationClick.bind(self),
                    introName: 'child_middle_' + value,
                    invisible: false,
                    classGenerator: this.childClassGenerator.bind(self)
                };
            })
            .value();
    }

    toggleColumnActivationClick(tile) {
        if (this.editMode && !tile.empty) {
            tile.activated = !tile.activated;
            this.EE.emit('hssColumnActiveState', [tile.columnId, tile.activated]);
        }
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
