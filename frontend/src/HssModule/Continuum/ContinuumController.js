import _ from 'lodash';
import angular from 'angular';

class ContinuumController {

    constructor($timeout, $element) {
        this.EE = window.EE;
        this.gridLoading = false;
        this.editMode = false;
        this.isFixed = false;
        this.rowHeight = 51;
        this.helperRealHeight = (this.rowHeight * 3) + 'px';
        this.mapsProgressPercentage = 68; // Placeholder!!
        this.timeout = $timeout;
        this.element = $element;
        this.classGenerator = this.classGenerator.bind(this);
        this.mdContent = angular.element(document.getElementsByTagName('md-content')[0]);
        this.mdContent.on('scroll', this.scrollEventHandler.bind(this));
        this.$onInit = this.init.bind(this);

    }

    init() {
        const vm = this;
        vm.EE.on('editModeDone', vm.editModeChangeDone.bind(vm));
        vm.hs = this.service;
        vm.showEditModeSpinner = false;
        vm.firstRow = this.firstRowGenerator();
        vm.motherRow = this.motherRowGenerator();
        vm.childRow = this.childRowGenerator();
        vm.motherRow.forEach(tile => {
            vm.checkColumnActivation(tile);
        });
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

    childRowGenerator() {
        const self = this;
        return _.chain(this.tiles)
            .range()
            .map(value => {
                return {
                    type: 'child',
                    content: self.structure[value].child.title,
                    className: 'child',
                    colSpan: 1,
                    rowSpan: 1,
                    columnId: value,
                    activated: self.data[value].child,
                    empty: !self.structure[value].child.title,
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
        else if (!tile.activated) {
            this.EE.once('hssGuysActivateColumn', () => {
                this.changeTileStatus(tile, true);
            });
            this.EE.emit('hssPleaseActivateColumn', {
                columnId: tile.columnId,
                activated: true
            });
            if (tile.type === 'mother' && tile.columnId === 5) {
                this.EE.emit('hssPleaseActivateColumn', {
                    columnId: 6,
                    activated: true
                });
            }
        }

        // DEACTIVATING
        else {

            if (tile.columnId < 4) {
                this.EE.once('hssGuysActivateColumn', obj => {
                    this.changeTileStatus(tile, obj.activated);
                });
                this.EE.emit('hssHasColumnContent', tile.columnId);
            }

            else if (tile.columnId === 4 &&
                this.motherRow[tile.columnId].activated &&
                this.childRow[tile.columnId].activated) {
                this.changeTileStatus(tile, false);
            }

            else if (tile.columnId === 4) {
                this.EE.once('hssGuysActivateColumn', obj => {
                    this.changeTileStatus(tile, obj.activated);
                });
                this.EE.emit('hssHasColumnContent', tile.columnId);
            }

            else if (tile.type === 'mother') {
                if (this.childRow[5].activated && this.childRow[6].activated) {
                    this.changeTileStatus(tile, false);
                }
                this.EE.once('hssHasContentLastTwo', obj => {

                    const needed = (obj.five && this.childRow[5].activated === false) ||
                        (obj.six && this.childRow[6].activated === false);

                    if (!needed) {
                        tile.activated = false;
                        this.changeTileStatus(tile, false);
                        if (!obj.six && this.childRow[6].activated === false) {
                            this.EE.emit('hssHasColumnContent', 6);
                        }
                        if (!obj.five && this.childRow[5].activated === false) {
                            this.EE.emit('hssHasColumnContent', 5);
                        }
                    }
                });

                this.EE.emit('hssHasColumnContentLastTwo');
            }

            else {
                if (this.motherRow[5].activated) {
                    this.changeTileStatus(tile, false);
                }
                else {
                    this.EE.once('hssGuysActivateColumn', obj => {
                        this.changeTileStatus(tile, obj.activated);
                    });
                    this.EE.emit('hssHasColumnContent', tile.columnId);
                }
            }
        }
        this.checkColumnActivation(tile);
    }

    changeTileStatus(tile, newStatus) {
        tile.activated = newStatus;
        this.hs.postContinuum(tile);
    }

    // First row activation handling for ng-class bindings (missing childs/double)
    checkColumnActivation(tile) {
        if (tile.columnId < 4) {
            this.firstRow[tile.columnId].activated = tile.activated;
        }
        else if (tile.columnId === 4) {
            this.firstRow[tile.columnId].activated = tile.activated ||
                this.motherRow[4].activated ||
                this.childRow[4].activated;
        }
        else if (tile.columnId === 5) {
            this.firstRow[5].activated = this.childRow[5].activated || this.motherRow[5].activated;
            this.firstRow[6].activated = this.childRow[6].activated || this.motherRow[5].activated;
        }
        else {
            this.firstRow[6].activated = this.childRow[6].activated || this.motherRow[5].activated;
        }
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
