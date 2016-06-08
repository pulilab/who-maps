import _ from 'lodash';
import angular from 'angular';

class ContinuumController {

    constructor($timeout, $element) {
        this.EE = window.EE;
        this.timeout = $timeout;
        this.element = $element;
        this.$onInit = this.onInit.bind(this);

    }

    onInit() {
        const vm = this;
        vm.bindEvents();
        this.gridLoading = false;
        this.editMode = false;
        this.isFixed = false;
        this.rowHeight = 60;
        this.numberOfRow = 1;
        this.helperRealHeight = (this.rowHeight * this.numberOfRow) + 'px';
        this.classGenerator = this.classGenerator.bind(this);
        vm.hs = this.service;
        vm.showEditModeSpinner = false;
        vm.firstRow = this.firstRowGenerator();
        vm.motherRow = this.motherRowGenerator();

    }

    onDestroy() {
        const vm = this;
        vm.onDestroy();
        vm.removeEvents();
    }

    bindEvents() {
        const vm = this;
        vm.EE.on('editModeDone', vm.editModeChangeDone, vm);
        vm.mdContent = angular.element(document.getElementsByTagName('md-content')[0]);
        vm.mdContent.on('scroll', vm.scrollEventHandler.bind(vm));
    }

    removeEvents() {
        const vm = this;
        vm.EE.removeListener('editModeDone', vm.editModeChangeDone, vm);
    }

    layoutDone() {
        this.EE.emit('hssInnerLayoutDone', 'continuum');
    }

    editModeChangeDone() {
        this.showEditModeSpinner = false;
    }
    scrollEventHandler() {
        const vm = this;
        vm.timeout(() => {
            if (angular.element(vm.element)[0]) {
                const scrollTop = this.mdContent[0].scrollTop;
                vm.isFixed = scrollTop >= angular.element(vm.element)[0].offsetTop;
                vm.helperHeight = vm.isFixed ? vm.helperRealHeight : 0;
            }
        });
    }

    editModeChange() {
        const vm = this;
        vm.editMode = !vm.editMode;
        vm.showEditModeSpinner = true;
        this.timeout(()=> {
            this.EE.emit('hssEditMode', vm.editMode);
        });
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
                    content: self.structure[value].mother.title,
                    colSpan: self.structure[value].mother.span,
                    rowSpan: 1,
                    invisible: _.isEmpty(self.structure[value].mother),
                    clickHandler: this.toggleColumnActivationClick.bind(self),
                    columnId: value,
                    activated: self.data[value].mother,
                    introName: 'mother_middle_' + value,
                    classGenerator: this.classGenerator
                };
            })
            .filter({
                invisible: false
            })
            .value();
    }

    classGenerator(tile) {
        const classes = [];
        classes.push(tile.type);
        classes.push((tile.columnId + 1) % 2 === 0 ? 'even' : 'odd');
        classes.push(tile.activated ? 'activated' : 'deactivated');
        classes.push('zindex-' + (100 - (tile.columnId * 10)));
        classes.push(tile.introName);

        if (tile.type === 'child' && this.structure) {
            classes.push(this.structure[tile.columnId].child.title ? 'filled' : 'empty');
        }

        return classes.join(' ');
    }

    toggleColumnActivationClick(tile) {
        if (!this.editMode || tile.empty) {
            return;
        }
        // ACTIVATING
        if (!tile.activated) {
            this.EE.once('hssGuysActivateColumn', () => {
                this.changeTileStatus(tile, true);
            });
            this.EE.emit('hssPleaseActivateColumn', {
                columnId: tile.columnId,
                activated: true
            });
        }

        // DEACTIVATING
        else {
            this.EE.once('hssGuysActivateColumn', obj => {
                this.changeTileStatus(tile, obj.activated);
            });
            this.EE.emit('hssHasColumnContent', tile.columnId);

        }
    }

    changeTileStatus(tile, newStatus) {
        tile.activated = newStatus;
        this.hs.postContinuum(tile);
    }


    exportPdf() {
        console.warn('The "export to .pdf" function is not yet available!');
    }


    static continuumFactory() {
        require('./Continuum.scss');
        function continuum($timeout, $element) {
            return new ContinuumController($timeout, $element);
        }

        continuum.$inject = ['$timeout', '$element'];

        return continuum;
    }
}

export default ContinuumController;
