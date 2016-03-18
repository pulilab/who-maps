import _ from 'lodash';

class ContinuumController {

    constructor($timeout) {
        const vm = this;
        $timeout(() => {
            vm.editMode = false;
            vm.uList = this.uListGenerator();
            vm.firstRow = this.firstRowGenerator();
        });
    }

    uListGenerator() {
        return _.range(this.tiles);
    }

    firstRowGenerator() {
        return _.map(this.uList, (value) => {
            return {
                icon: require('./images/continuum-' + (value + 1) + '.svg'),
                colSpan: 1,
                rowSpan: 1,
                className: (value + 1) % 2 === 0 ? 'even' : 'odd'
            };
        });
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
