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
        this.EE.emit('editMode', vm.editMode);
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

    motherRowGenerator() {
        return _.chain(this.tiles)
            .range()
            .map(value => {
                return {
                    content: hss[value].mother.title,
                    colSpan: hss[value].mother.span,
                    rowSpan: 1,
                    invisible: _.isEmpty(hss[value].mother),
                    clickHandler: void 0, // wire the clicking function
                    columnId: value,
                    activated: hss[value].activated,
                    className: ((value + 1) % 2 === 0 ? 'even' : 'odd') + ' mother',
                    introName: 'mother_middle_' + value
                };
            })
            .filter({
                invisible: false
            })
            .value();
    }

    childRowGenerator() {
        return _.chain(this.tiles)
            .range()
            .map(value => {
                return {
                    content: hss[value].child.title,
                    className: (!hss[value].child.title ? 'empty' : '')
                    + ' ' + ((value + 1) % 2 === 0 ? 'even' : 'odd')
                    + ' child',
                    colSpan: 1,
                    rowSpan: 1,
                    columnId: value,
                    activated: hss[value].activated,
                    empty: !hss[value].child.title,
                    clickHandler: void 0, // wire the clicking function
                    introName: 'child_middle_' + value,
                    invisible: false
                };
            })
            .value();
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
