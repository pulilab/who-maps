import _ from 'lodash';
import { hss, applicationsLib, taxonomyLib } from '../hssMockData';

class ApplicationsController {

    constructor($timeout, $mdDialog) {
        const vm = this;
        this.rowObject = {};
        this.layoutReady = false;
        $timeout(() => {
            vm.EE = window.EE;
            this.dialog = $mdDialog;
            vm.editMode = false;
            this.startTile = {};
            this.tileClickCounter = 0;
            this.selectedConstraints = [];
            this.applicationRow = this.applicationRowGenerator();
            vm.EE.on('hssEditMode', this.handleEditMode.bind(this));
            vm.EE.on('hssGuysActivateColumn', this.handleColumnActivation.bind(this));
            vm.EE.on('hssConstraintsSelected', this.constraintsUpdated.bind(this));
            this.searchForFilledColumns();
        });
    }

    handleEditMode(value) {
        this.editMode = value;
        this.processRows();
    }

    layoutDone() {
        this.layoutReady = true;
    }

    handleColumnActivation(event) {
        _.map(this.applicationRow, (value) => {
            if (value.columnId === event.columnId) {
                value.activated = event.activated;
            }
            return value;
        });
    }

    constraintsUpdated(event) {
        this.selectedConstraints = _.chain(event)
            .map(value => {
                value.taxonomy = taxonomyLib[value.name].values;
                return value;
            })
            .filter(item => {
                return item.active;
            })
            .value();
    }

    classGenerator(tile) {
        const classArray = [tile.className];
        classArray.push((tile.columnId + 1) % 2 === 0 ? 'even' : 'odd');
        classArray.push(tile.isMain ? 'app-main' : 'app-sub');
        classArray.push(tile.introName);
        return classArray.join(' ');
    }

    applicationClassGenerator(tile) {
        const classArray = this.classGenerator(tile).split(' ');

        classArray.push(tile.rowBubbles && tile.rowBubbles.length > 0
            ? tile.applicationStyle : 'application_disabled');
        classArray.push(tile.status ? tile.status : 'no-bubble');
        classArray.push(tile.activated ? 'activated' : 'not-activated');
        classArray.push(tile.subAppOpen ? 'app-open' : 'app-closed');
        return classArray.join(' ');
    }

    applicationActivated(value) {
        let _activated = hss[value].mother.activated;
        if (hss[value].child) {
            _activated = _activated || hss[value].child.activated;
        }
        return _activated;
    }

    applicationHeaderGenerator(index) {
        const subApp = _.values(applicationsLib[index].subApplications);
        return [{
            content: applicationsLib[index].name,
            className: 'app-header',
            colSpan: 2,
            rowSpan: 1,
            columnId: 'header',
            rowIndex: index,
            subApplications: subApp,
            applicationId: applicationsLib[index].id,
            isHeader: true,
            isMain: true,
            rowBubbles: [],
            classGenerator: this.applicationClassGenerator.bind(this),
            clickHandler: this.toggleSubApp.bind(this),
            introName: 'applications_header_' + index,
            applicationStyle: 'application_' + applicationsLib[index].id,
            fatherId: 0
        }];
    }

    applicationsMiddleColumnDecorator(index) {
        return _.chain(this.tiles)
            .range()
            .map(value => {
                return {
                    content: '',
                    className: 'app',
                    rowIndex: index,
                    columnId: value,
                    colSpan: 1,
                    rowSpan: 1,
                    bubbleDrawn: false,
                    isInput: true,
                    invisible: false,
                    subAppOpen: false,
                    isMain: true,
                    rowEnabled: false,
                    applicationId: applicationsLib[index].id,
                    activated: this.applicationActivated(value),
                    introName: 'applications_middle_' + value,
                    classGenerator: this.applicationClassGenerator.bind(this),
                    clickHandler: this.appClickHandler.bind(this),
                    fatherId: 0
                };
            })
            .value();
    }

    subApplicationClassGenerator(subApp, tile) {
        const classArray = this.applicationClassGenerator(tile).split(' ');
        classArray.push(tile.rowIndex === subApp.length - 1 ? 'lastSub' : 'sub');
        return classArray.join(' ');
    }

    appLabelGenerator(id, index) {
        const alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];
        return '' + id + alphabet[index];
    }

    subApplicationHeaderGenerator(subApp, index, id) {
        return [{
            content: subApp[index],
            className: 'app-header',
            colSpan: 2,
            rowSpan: 1,
            isInput: false,
            isHeader: true,
            isMain: false,
            rowEnabled: false,
            columnId: 'header',
            rowIndex: index,
            fatherId: id,
            applicationId: this.appLabelGenerator(id, index),
            disabled: true,
            rowBubbles: [],
            classGenerator: this.subApplicationClassGenerator.bind(this, subApp),
            clickHandler: void 0,
            applicationStyle: 'application_' + applicationsLib[id - 1].id
        }];
    }

    subAppMiddleColumnDecorator(subApp, index, id) {
        return _.chain(this.tiles)
            .range()
            .map(value => {
                return {
                    content: '',
                    className: 'app',
                    rowIndex: index,
                    columnId: value,
                    colSpan: 1,
                    rowSpan: 1,
                    bubbleDrawn: false,
                    isInput: true,
                    insertMode: false,
                    invisible: false,
                    applicationId: this.appLabelGenerator(id, index),
                    activated: this.applicationActivated(value),
                    fatherId: id,
                    disabled: true,
                    isMain: false,
                    clickHandler: this.appClickHandler.bind(this),
                    classGenerator: this.subApplicationClassGenerator.bind(this, subApp)
                };
            })
            .value();
    }

    taxonomyColumnGenerator(index, id, isSubApp) {
        return [{
            content: '',
            className: 'app-tax',
            colSpan: 2,
            rowSpan: 1,
            columnId: 'tax',
            fatherId: id,
            isInput: false,
            isSelect: true,
            isMain: !isSubApp,
            disabled: isSubApp,
            isTax: true,
            rowIndex: index,
            rowEnabled: false,
            introName: 'taxonomy_app_' + index,
            classGenerator: this.classGenerator.bind(this)
        }];
    }

    subApplicationRows(index) {
        let cols = [];
        const subApp = _.values(applicationsLib[index].subApplications);
        const appId = applicationsLib[index].id;

        for (let i = 0; i < subApp.length; i += 1) {
            cols = cols.concat(this.subApplicationHeaderGenerator(subApp, i, appId));
            cols = cols.concat(this.subAppMiddleColumnDecorator(subApp, i, appId));
            cols = cols.concat(this.taxonomyColumnGenerator(i, appId, true));
        }
        return cols;
    }


    applicationRowGenerator() {
        const appNumber = applicationsLib.length;
        let cols = [];
        for (let i = 0; i < appNumber; i += 1) {
            cols = cols.concat(this.applicationHeaderGenerator(i));
            cols = cols.concat(this.applicationsMiddleColumnDecorator(i));
            cols = cols.concat(this.taxonomyColumnGenerator(i, 0));
            cols = cols.concat(this.subApplicationRows(i));
        }
        this.createRowStructure(cols);
        return cols;
    }

    processRows() {
        _.chain(11)
            .range()
            .forEach(value => {
                if (value === 0) { // skip the main app
                    return;
                }
                _.forEach(this.rowObject['father_' + value], row => {
                    let isEnabled = false;
                    _.forEach(row, item => {
                        isEnabled = (item.isInput && item.content.length > 0) || isEnabled;
                    });
                    _.forEach(row, item => {
                        item.disabled = !isEnabled;
                    });
                });
            })
            .value();
    }

    createRowStructure(rows) {
        const vm = this;
        _.forEach(rows, item => {
            _.set(vm.rowObject,
                'father_' + item.fatherId + '.rowIndex_' + item.rowIndex + '.columnId_' + item.columnId,
                item);
        });
        this.processRows();
    }

    toggleSubApp(tile) {
        if (!tile.subApplications || !this.editMode) {
            return;
        }
        this.layoutReady = false;
        tile.subAppOpen = !tile.subAppOpen;
        _.forEach(this.rowObject['father_' + tile.applicationId], value => {
            _.forEach(value, item => {
                item.disabled = !tile.subAppOpen;
            });
        });
    }

    appClickHandler(tile) {
        if (tile.bubbleDrawn || !this.editMode || !tile.activated) {
            return;
        }
        if (this.tileClickCounter === 0) {
            this.tileClickCounter = this.tileClickCounter + 1;
            this.tileBalloonStartHandler(tile);
        }
        else if (this.tileClickCounter === 1) {
            this.tileClickCounter = 0;
            this.tileBalloonEndHandler(tile);
        }
    }

    inputHandler(tile, event) {
        if (event.which === 13) {
            tile.insertMode = false;
        }
    }

    findSameRowCandidate(tile) {
        if (tile.rowIndex !== this.startTile.rowIndex
            || this.startTile.fatherId !== tile.fatherId) {
            return [];
        }
        return _.chain(this.rowObject['father_' + tile.fatherId]['rowIndex_' + tile.rowIndex])
            .filter(value => {
                return value.activated === true
                    && value.columnId >= this.startTile.columnId
                    && value.columnId <= tile.columnId;
            })
            .thru(result => {
                return this.isRowContiguous(result);
            })
            .value();

    }

    isRowContiguous(input) {
        let result = input;
        let columnIds = _.map(result, value => {
            return parseInt(value.columnId, 10);
        });
        const max = _.max(columnIds);
        const min = _.min(columnIds);

        if (columnIds.length !== max - min + 1) {
            result = [];
        }

        columnIds = _.map(columnIds, value => {
            return value - min + 1;
        });
        for (let i = 0; i < columnIds.length; i += 1) {
            const x = Math.abs(columnIds[i]);
            if (columnIds[x - 1] > 0) {
                columnIds[x - 1] = columnIds[x - 1] * -1;
            }
            else {
                result = [];
            }
        }
        return result;
    }

    tileBalloonStartHandler(tile) {
        this.startTile = tile;
        tile.className += 'selected';
    }

    tileBalloonEndHandler(tile) {
        let applicationStyle;
        const rowColumns = this.findSameRowCandidate(tile);
        if (rowColumns.length === 0) {
            this.startTile.className = 'app';
            this.startTile = void 0;
            return;
        }

        _.map(this.rowObject['father_' + tile.fatherId]['rowIndex_' + tile.rowIndex], value => {
            if (value.isHeader) {
                applicationStyle = value.applicationStyle;
                value.rowBubbles.push(rowColumns[0].columnId);
            }
            value.rowEnabled = true;
            return value;
        });

        rowColumns.forEach((value, key)=> {
            if (key === 0) {
                value.colSpan = rowColumns.length;
                value.bubbleDrawn = true;
                value.status = applicationStyle;
            }
            else {
                value.invisible = true;
            }
        });

        this.applicationRow = _.filter(this.applicationRow, (value) => {
            return !value.invisible || !value.isInput;
        });

        this.searchForFilledColumns();
    }

    deleteBubble(bubble) {
        const toAdd = [];
        const index = _.findIndex(this.applicationRow, bubble);
        _.chain(bubble.colSpan)
            .range()
            .forEach(tileIndex => {
                const colId = 'columnId_' + (bubble.columnId + tileIndex);
                const item = this.rowObject['father_' + bubble.fatherId]['rowIndex_' + bubble.rowIndex][colId];
                item.colSpan = 1;
                item.content = '';
                item.bubbleDrawn = false;
                item.status = '';
                item.invisible = false;
                item.className = _.replace(item.className, 'selected', '');
                if (tileIndex !== 0) {
                    toAdd.push(item);
                }
            })
            .value();
        _.forEach(toAdd, (value, key) => {
            this.applicationRow.splice((index + key + 1), 0, value);
        });
        _.map(this.rowObject['father_' + bubble.fatherId]['rowIndex_' + bubble.rowIndex], value => {
            if (value.isHeader) {
                _.remove(value.rowBubbles, n => {
                    return n === bubble.columnId;
                });
            }
            value.rowEnabled = false;
            return value;
        });
        this.searchForFilledColumns();
    }

    confirmDeleteBubble(bubble) {
        const vm = this;
        const confirm = this.dialog.confirm()
            .title('Warning')
            .textContent('Are you sure?')
            .ariaLabel('Bubble Delete')
            .ok('Ok')
            .cancel('Cancel');
        this.dialog.show(confirm).then(() => {
            vm.deleteBubble(bubble);
        });
    }

    searchForFilledColumns() {

        const containArr = _.fill(new Array(7), false);

        const notEmpties = this.applicationRow.filter(el => {
            return el.bubbleDrawn;
        });

        notEmpties.forEach(el => {
            for (let i = +el.columnId; i <= el.columnId + el.colSpan - 1; i += 1) {
                containArr[i] = true;
            }
        });

        this.EE.emit('hssColumnContents', containArr);
    }

    static applicationsFactory() {
        require('./Applications.scss');
        function applications($timeout, $mdDialog) {
            return new ApplicationsController($timeout, $mdDialog);
        }

        applications.$inject = ['$timeout', '$mdDialog'];

        return applications;
    }

}

export default ApplicationsController;
